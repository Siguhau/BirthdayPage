import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { clearGameProgress } from "../persistence/gameProgress";
import { getPhotoFailureHint } from "../puzzles/photoFailureHint";
import {
  failedLongboiPhotos,
  getRepeatingPhoto,
  longboiPhotoItemIds,
  shuffleLongboiPhotos,
  successfulLongboiPhotos,
} from "../puzzles/longboiPhotos";
import type {
  ItemId,
  MirrorItemId,
  MirrorOrientations,
  PuzzleId,
} from "../state/gameTypes";
import Building from "./Building";
import CameraBattery from "./CameraBattery";
import { isSpawnBlacklightActive } from "./blacklight";
import BasementTrapdoor from "./BasementTrapdoor";
import BasementLadder from "./BasementLadder";
import CipherBust from "./CipherBust";
import CipherPlaqueModal from "./CipherPlaqueModal";
import GameMenu from "./GameMenu";
import HiddenRoomWallToggle from "./HiddenRoomWallToggle";
import InteractionSystem from "./InteractionSystem";
import { createInteractionKeyGate } from "./interactionKeyGate";
import LightFixtures from "./LightFixtures";
import LaserPanelModal from "./LaserPanelModal";
import LaserPuzzleWorld from "./LaserPuzzleWorld";
import LongboiPhotoModal, {
  type LongboiPhotoResult,
} from "./LongboiPhotoModal";
import LoosePhotoCamera from "./LoosePhotoCamera";
import MouseLookController from "./MouseLookController";
import PhotoChallenge from "./PhotoChallenge";
import PhotoCameraStand from "./PhotoCameraStand";
import PhotoStudioDecor from "./PhotoStudioDecor";
import PlayerController from "./PlayerController";
import ReadingCorner from "./ReadingCorner";
import SlidingDoor from "./SlidingDoor";
import TripodCupboard from "./TripodCupboard";
import TrapdoorCipherClue from "./TrapdoorCipherClue";
import TrapdoorCodeModal from "./TrapdoorCodeModal";
import WorkshopDisco from "./WorkshopDisco";
import WallPhotoHook from "./WallPhotoHook";
import WorldHud from "./WorldHud";
import { releaseMouseLook, requestMouseLook } from "./mouseLook";
import {
  defaultAreaId,
  getArea,
  photoCameraPosition,
  worldDoors,
  worldGravity,
  worldInteractions,
} from "./worldConfig";
import CaptchaStation from "./CaptchaStation";
import CornArcadeStation from "./CornArcadeStation";
import DanceStation from "./DanceStation";
import FoodScatter from "./FoodScatter";
import type {
  AreaId,
  DoorId,
  WorldInteraction,
  WorldSwitchId,
} from "./worldTypes";
import "./EscapeRoomWorld.css";

const toastDurationMs = 4_000;

const getPhotoInteractionLabel = ({
  batteryInstalled,
  cameraMounted,
  hasBattery,
  hasCamera,
  hasTripod,
  longboiPhotoCount,
  tripodPlaced,
}: {
  batteryInstalled: boolean;
  cameraMounted: boolean;
  hasBattery: boolean;
  hasCamera: boolean;
  hasTripod: boolean;
  longboiPhotoCount: number;
  tripodPlaced: boolean;
}) => {
  if (!tripodPlaced) {
    return hasTripod
      ? "Plasser stativet på fotomerket"
      : "Her skal et kamerastativ stå";
  }
  if (!cameraMounted) {
    return hasCamera ? "Monter kameraet på stativet" : "Undersøk stativet";
  }
  if (!batteryInstalled) {
    return hasBattery ? "Sett batteriet i kameraet" : "Undersøk kameraet";
  }
  return `Ta Longboi-bilde (${String(longboiPhotoCount)}/2)`;
};

type EscapeRoomWorldProps = {
  activePuzzleOpen: boolean;
  chestOpen: boolean;
  installedItemIds: readonly ItemId[];
  inventoryItemIds: readonly ItemId[];
  laserPowered: boolean;
  mirrorOrientations: MirrorOrientations;
  onCollectPepsi: () => void;
  onEnterLaserCode: (code: string) => void;
  onInstallItem: (itemId: ItemId) => void;
  onOpenPuzzle: (puzzleId: PuzzleId) => void;
  onPickUpItem: (itemId: ItemId) => void;
  onReset: () => void;
  onRotateMirror: (itemId: MirrorItemId) => void;
  onSolvePuzzle: (puzzleId: PuzzleId) => void;
  solvedPuzzleIds: readonly PuzzleId[];
};

const EscapeRoomWorld = ({
  activePuzzleOpen,
  chestOpen,
  installedItemIds,
  inventoryItemIds,
  laserPowered,
  mirrorOrientations,
  onCollectPepsi,
  onEnterLaserCode,
  onInstallItem,
  onOpenPuzzle,
  onPickUpItem,
  onReset,
  onRotateMirror,
  onSolvePuzzle,
  solvedPuzzleIds,
}: EscapeRoomWorldProps) => {
  const [areaId, setAreaId] = useState<AreaId>(defaultAreaId);
  const [isPaused, setIsPaused] = useState(false);
  const [isCipherPlaqueOpen, setIsCipherPlaqueOpen] = useState(false);
  const [isLaserPanelOpen, setIsLaserPanelOpen] = useState(false);
  const [isTrapdoorCodeOpen, setIsTrapdoorCodeOpen] = useState(false);
  const [activeWallSwitchIds, setActiveWallSwitchIds] = useState<
    ReadonlySet<WorldSwitchId>
  >(() => new Set());
  const [openDoorIds, setOpenDoorIds] = useState<DoorId[]>([]);
  const [eatenFoodIds, setEatenFoodIds] = useState<string[]>([]);
  const [cornArcadePowered, setCornArcadePowered] = useState(false);
  const [overfull, setOverfull] = useState(false);
  const [target, setTarget] = useState<WorldInteraction | null>(null);
  const [interactionMessage, setInteractionMessage] = useState<string | null>(
    null,
  );
  const [photoAttemptId, setPhotoAttemptId] = useState(0);
  const [photoCountdown, setPhotoCountdown] = useState<number | null>(null);
  const [photoFlashToken, setPhotoFlashToken] = useState(0);
  const [photoResult, setPhotoResult] = useState<LongboiPhotoResult | null>(
    null,
  );
  const [successfulPhotoDeck] = useState(() =>
    shuffleLongboiPhotos(successfulLongboiPhotos),
  );
  const [failedPhotoDeck] = useState(() =>
    shuffleLongboiPhotos(failedLongboiPhotos),
  );
  const failedPhotoAttempt = useRef(0);
  const wasPointerLocked = useRef(document.pointerLockElement !== null);
  const suppressMenuOnUnlock = useRef(false);
  const interactionKeyGate = useRef(createInteractionKeyGate());
  const area = getArea(areaId);
  const worldPaused =
    isPaused ||
    isCipherPlaqueOpen ||
    isLaserPanelOpen ||
    isTrapdoorCodeOpen ||
    activePuzzleOpen ||
    photoResult !== null;
  const hasCamera = inventoryItemIds.includes("camera");
  const hasCameraBattery = inventoryItemIds.includes("camera-battery");
  const hasTripod = inventoryItemIds.includes("tripod");
  const cameraMounted = installedItemIds.includes("camera");
  const cameraBatteryInstalled = installedItemIds.includes("camera-battery");
  const tripodPlaced = installedItemIds.includes("tripod");
  const hungLongboiPhoto =
    successfulLongboiPhotos.find(({ itemId }) =>
      installedItemIds.includes(itemId),
    ) ?? null;
  const blacklightActive = isSpawnBlacklightActive(
    activeWallSwitchIds,
    installedItemIds,
  );
  const longboiPhotoCount = longboiPhotoItemIds.filter(
    (itemId) =>
      inventoryItemIds.includes(itemId) || installedItemIds.includes(itemId),
  ).length;
  const mirrorInventoryCount = (
    ["mirror-1", "mirror-2", "mirror-3"] as const
  ).filter((itemId) => inventoryItemIds.includes(itemId)).length;
  const inventoryLabels = [
    hasCamera ? "Kamera" : null,
    hasCameraBattery ? "Kamerabatteri" : null,
    hasTripod ? "Kamerastativ" : null,
    longboiPhotoCount > 0
      ? `Longboi-bilder ${String(longboiPhotoCount)}/2`
      : null,
    mirrorInventoryCount > 0 ? `Speil ${String(mirrorInventoryCount)}` : null,
    solvedPuzzleIds.includes("corn-chase") ? "Arkade: 1 · 99 · 6" : null,
  ].filter((label): label is string => label !== null);
  const availableInteractions = useMemo(
    () =>
      worldInteractions.flatMap((interaction) => {
        const { action } = interaction;

        if (
          action.type === "open-door" &&
          openDoorIds.includes(action.doorId)
        ) {
          return [];
        }
        if (
          action.type === "open-trapdoor-lock" &&
          openDoorIds.includes("basement-trapdoor")
        ) {
          return [];
        }
        if (
          action.type === "pick-up-item" &&
          (inventoryItemIds.includes(action.itemId) ||
            installedItemIds.includes(action.itemId))
        ) {
          return [];
        }
        if (
          action.type === "eat-food" &&
          eatenFoodIds.includes(action.foodId)
        ) {
          return [];
        }
        if (action.type === "plug-corn-arcade" && cornArcadePowered) return [];
        if (action.type === "start-photo" && photoCountdown !== null) {
          return [];
        }
        if (action.type === "hang-longboi-photo" && hungLongboiPhoto !== null) {
          return [];
        }
        if (action.type === "collect-pepsi" && !chestOpen) return [];
        if ("puzzleId" in action && solvedPuzzleIds.includes(action.puzzleId)) {
          return [];
        }

        if (action.type === "toggle-wall-switch") {
          return [
            {
              ...interaction,
              label: activeWallSwitchIds.has(action.switchId)
                ? "Slå av veggbryteren"
                : "Slå på veggbryteren",
            },
          ];
        }

        if (action.type === "hang-longboi-photo") {
          return [
            {
              ...interaction,
              label: longboiPhotoItemIds.some((itemId) =>
                inventoryItemIds.includes(itemId),
              )
                ? "Heng et Longboi-bilde på kroken"
                : "Undersøk den tomme bildekroken",
            },
          ];
        }

        if (action.type === "open-laser-panel") {
          return [
            {
              ...interaction,
              label: laserPowered
                ? "Inspiser det aktive laserpanelet"
                : "Tast inn koden på laserpanelet",
            },
          ];
        }

        if (action.type === "place-or-rotate-mirror") {
          const installed = installedItemIds.includes(action.itemId);
          const carried = inventoryItemIds.includes(action.itemId);
          return [
            {
              ...interaction,
              label: installed
                ? `Drei speil ${action.itemId.slice(-1)}`
                : carried
                  ? `Plasser speil ${action.itemId.slice(-1)} i sokkelen`
                  : `Undersøk tom speilsokkel ${action.itemId.slice(-1)}`,
            },
          ];
        }

        if (action.type !== "start-photo") {
          return [interaction];
        }

        return [
          {
            ...interaction,
            label: getPhotoInteractionLabel({
              batteryInstalled: cameraBatteryInstalled,
              cameraMounted,
              hasBattery: hasCameraBattery,
              hasCamera,
              hasTripod,
              longboiPhotoCount,
              tripodPlaced,
            }),
            position: tripodPlaced
              ? interaction.position
              : ([
                  photoCameraPosition[0],
                  0.6,
                  photoCameraPosition[2],
                ] as const),
          },
        ];
      }),
    [
      activeWallSwitchIds,
      cameraBatteryInstalled,
      cornArcadePowered,
      eatenFoodIds,
      cameraMounted,
      chestOpen,
      hasCamera,
      hasCameraBattery,
      hasTripod,
      hungLongboiPhoto,
      installedItemIds,
      inventoryItemIds,
      laserPowered,
      longboiPhotoCount,
      openDoorIds,
      photoCountdown,
      solvedPuzzleIds,
      tripodPlaced,
    ],
  );
  const worldStyle = {
    "--world-accent": area.theme.accent,
    "--world-background": area.theme.background,
    "--world-panel": area.theme.panel,
    "--world-text": area.theme.text,
  } as CSSProperties;

  const openMenu = useCallback(() => {
    setIsPaused(true);
    releaseMouseLook();
  }, []);

  useEffect(() => {
    if (!overfull) return;
    const timeout = window.setTimeout(() => {
      setOverfull(false);
    }, 5_000);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [overfull]);

  const closePhotoResult = useCallback(() => {
    setPhotoResult(null);
    requestMouseLook();
  }, []);

  const closeCipherPlaque = useCallback(() => {
    setIsCipherPlaqueOpen(false);
    requestMouseLook();
  }, []);

  const closeLaserPanel = useCallback(() => {
    setIsLaserPanelOpen(false);
    requestMouseLook();
  }, []);

  const closeTrapdoorCode = useCallback(() => {
    setIsTrapdoorCodeOpen(false);
    requestMouseLook();
  }, []);

  const unlockTrapdoor = useCallback(() => {
    setOpenDoorIds((currentDoorIds) =>
      currentDoorIds.includes("basement-trapdoor")
        ? currentDoorIds
        : [...currentDoorIds, "basement-trapdoor"],
    );
    setIsTrapdoorCodeOpen(false);
    setInteractionMessage(
      "Koden godtas. Teppet glir til side og kjellerlemmen åpner seg.",
    );
    requestMouseLook();
  }, []);

  useEffect(() => {
    if (interactionMessage === null) return;

    const timeout = window.setTimeout(() => {
      setInteractionMessage(null);
    }, toastDurationMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [interactionMessage]);

  const handlePhotoResult = useCallback(
    (result: {
      distance: number;
      horizontalAngle: number;
      pitch: number;
      success: boolean;
    }) => {
      setPhotoCountdown(null);
      setPhotoFlashToken((currentToken) => currentToken + 1);
      setInteractionMessage(null);

      if (document.pointerLockElement !== null) {
        suppressMenuOnUnlock.current = true;
      }
      releaseMouseLook();

      if (result.success) {
        const nextPhoto = successfulPhotoDeck.find(
          ({ itemId }) =>
            !inventoryItemIds.includes(itemId) &&
            !installedItemIds.includes(itemId),
        );

        if (nextPhoto === undefined) {
          onSolvePuzzle("photo-timer");
          return;
        }

        const nextCollectedCount = longboiPhotoCount + 1;
        onPickUpItem(nextPhoto.itemId);
        setPhotoResult({
          collectedCount: nextCollectedCount,
          details:
            nextCollectedCount === 2
              ? "To godkjente Longbois! Begge kan brukes senere i spillet."
              : "Godkjent! Ta ett vellykket Longboi-bilde til.",
          photo: nextPhoto,
        });

        if (nextCollectedCount === 2) {
          onSolvePuzzle("photo-timer");
        }
        return;
      }

      const failedPhoto = getRepeatingPhoto(
        failedPhotoDeck,
        failedPhotoAttempt.current,
      );
      failedPhotoAttempt.current += 1;
      const failureCount = failedPhotoAttempt.current;

      setPhotoResult({
        collectedCount: longboiPhotoCount,
        details: getPhotoFailureHint(result, failureCount),
        photo: failedPhoto,
      });
    },
    [
      failedPhotoDeck,
      installedItemIds,
      inventoryItemIds,
      longboiPhotoCount,
      onPickUpItem,
      onSolvePuzzle,
      successfulPhotoDeck,
    ],
  );

  useEffect(() => {
    const handlePointerLockChange = () => {
      const pointerLocked = document.pointerLockElement !== null;

      if (
        wasPointerLocked.current &&
        !pointerLocked &&
        suppressMenuOnUnlock.current
      ) {
        suppressMenuOnUnlock.current = false;
      } else if (
        wasPointerLocked.current &&
        !pointerLocked &&
        !activePuzzleOpen
      ) {
        setIsPaused(true);
      }
      wasPointerLocked.current = pointerLocked;
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape" && !activePuzzleOpen) {
        openMenu();
      }
      if (
        interactionKeyGate.current.handleKeyDown(event.code) &&
        target !== null &&
        !worldPaused
      ) {
        if (target.action.type === "open-door") {
          const { doorId } = target.action;
          setOpenDoorIds((currentDoorIds) =>
            currentDoorIds.includes(doorId)
              ? currentDoorIds
              : [...currentDoorIds, doorId],
          );
          setInteractionMessage(
            doorId === "basement-trapdoor"
              ? "Teppet glir til side. Kjellerlemmen åpner seg."
              : "Døren glir opp.",
          );
        } else if (target.action.type === "open-puzzle") {
          if (target.action.puzzleId === "corn-chase" && !cornArcadePowered) {
            setInteractionMessage("Arkaden er ikke koblet til strøm.");
            return;
          }
          if (document.pointerLockElement !== null) {
            suppressMenuOnUnlock.current = true;
          }
          onOpenPuzzle(target.action.puzzleId);
          releaseMouseLook();
        } else if (target.action.type === "pick-up-item") {
          onPickUpItem(target.action.itemId);
          setInteractionMessage(
            target.action.itemId === "camera"
              ? "Kameraet er lagt i inventaret."
              : target.action.itemId === "tripod"
                ? "Det sammenpakkede stativet er lagt i inventaret."
                : target.action.itemId.startsWith("mirror-")
                  ? "Speilet er lagt i inventaret."
                  : "Kamerabatteriet er lagt i inventaret.",
          );
        } else if (target.action.type === "eat-food") {
          const { foodId } = target.action;
          setEatenFoodIds((currentFoodIds) => {
            if (currentFoodIds.includes(foodId)) return currentFoodIds;
            const nextFoodIds = [...currentFoodIds, foodId];
            if (nextFoodIds.length >= 10) {
              setOverfull(true);
              setInteractionMessage("Jeg har spist for mye");
            } else {
              setInteractionMessage(
                `Nam! ${String(nextFoodIds.length)} matbiter spist.`,
              );
            }
            return nextFoodIds;
          });
        } else if (target.action.type === "plug-corn-arcade") {
          setCornArcadePowered(true);
          setInteractionMessage("Arkaden våkner til liv. Maisjakten er klar.");
        } else if (target.action.type === "toggle-wall-switch") {
          const { switchId } = target.action;
          const activating = !activeWallSwitchIds.has(switchId);
          setActiveWallSwitchIds((currentSwitchIds) => {
            const nextSwitchIds = new Set(currentSwitchIds);
            if (activating) {
              nextSwitchIds.add(switchId);
            } else {
              nextSwitchIds.delete(switchId);
            }
            return nextSwitchIds;
          });
          setInteractionMessage(
            activating
              ? hungLongboiPhoto === null
                ? "Veggbryteren klikker på. Ingenting skjer … ennå."
                : "Veggbryteren klikker på. Lyset over inngangen blir til blacklight."
              : "Veggbryteren klikker av.",
          );
        } else if (target.action.type === "hang-longboi-photo") {
          const photoItemId = longboiPhotoItemIds.find((itemId) =>
            inventoryItemIds.includes(itemId),
          );

          if (photoItemId === undefined) {
            setInteractionMessage("Kroken trenger et vellykket Longboi-bilde.");
            return;
          }

          onInstallItem(photoItemId);
          setInteractionMessage(
            activeWallSwitchIds.has("hidden-photo-switch")
              ? "Bildet trekker kroken ned. Lyset over inngangen blir til blacklight."
              : "Bildet trekker kroken ned, men lyset mangler fortsatt strøm.",
          );
        } else if (target.action.type === "inspect-cipher-plaque") {
          if (document.pointerLockElement !== null) {
            suppressMenuOnUnlock.current = true;
          }
          setIsCipherPlaqueOpen(true);
          releaseMouseLook();
        } else if (target.action.type === "open-laser-panel") {
          if (document.pointerLockElement !== null) {
            suppressMenuOnUnlock.current = true;
          }
          setIsLaserPanelOpen(true);
          releaseMouseLook();
        } else if (target.action.type === "open-trapdoor-lock") {
          if (document.pointerLockElement !== null) {
            suppressMenuOnUnlock.current = true;
          }
          setIsTrapdoorCodeOpen(true);
          releaseMouseLook();
        } else if (target.action.type === "place-or-rotate-mirror") {
          const { itemId } = target.action;
          if (installedItemIds.includes(itemId)) {
            onRotateMirror(itemId);
            setInteractionMessage(
              chestOpen
                ? "Strålen treffer låsen. Kisten åpner seg!"
                : "Speilet dreies. Følg den røde strålen.",
            );
          } else if (inventoryItemIds.includes(itemId)) {
            onInstallItem(itemId);
            setInteractionMessage(
              `Speil ${itemId.slice(-1)} er festet. Drei det for å lede strålen videre.`,
            );
          } else {
            setInteractionMessage(
              `Denne sokkelen trenger speil ${itemId.slice(-1)}. Let i de andre rommene.`,
            );
          }
        } else if (target.action.type === "collect-pepsi") {
          if (!chestOpen) return;
          setInteractionMessage("Pepsi Max funnet. Oppdraget er fullført!");
          onCollectPepsi();
        } else {
          if (!tripodPlaced) {
            if (hasTripod) {
              onInstallItem("tripod");
              setInteractionMessage(
                "Stativet er slått ut og plassert 1,5 meter fra fotoveggen.",
              );
            } else {
              setInteractionMessage(
                "Fotomerket mangler et stativ. Sjekk skapet i Memory Archive.",
              );
            }
            return;
          }
          if (!cameraMounted) {
            if (hasCamera) {
              onInstallItem("camera");
              setInteractionMessage("Kameraet er montert på stativet.");
            } else {
              setInteractionMessage(
                "Stativet mangler et kamera. Let i Oddities Workshop.",
              );
            }
            return;
          }
          if (!cameraBatteryInstalled) {
            if (hasCameraBattery) {
              onInstallItem("camera-battery");
              setInteractionMessage(
                "Batteriet klikker på plass. Kameraet er klart.",
              );
            } else {
              setInteractionMessage(
                "Kameraet mangler et batteri. Let i Memory Archive.",
              );
            }
            return;
          }
          if (photoCountdown !== null) return;
          setInteractionMessage(null);
          setPhotoAttemptId((currentAttempt) => currentAttempt + 1);
        }
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      interactionKeyGate.current.handleKeyUp(event.code);
    };
    const handleBlur = () => {
      interactionKeyGate.current.reset();
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange,
      );
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    activePuzzleOpen,
    activeWallSwitchIds,
    cameraBatteryInstalled,
    cameraMounted,
    chestOpen,
    cornArcadePowered,
    hasCamera,
    hasCameraBattery,
    hasTripod,
    hungLongboiPhoto,
    installedItemIds,
    inventoryItemIds,
    onInstallItem,
    onCollectPepsi,
    onOpenPuzzle,
    onPickUpItem,
    onRotateMirror,
    openMenu,
    photoCountdown,
    target,
    tripodPlaced,
    worldPaused,
  ]);

  return (
    <div className="escape-room-world" data-area={areaId} style={worldStyle}>
      <Canvas
        camera={{ far: 60, fov: 68, near: 0.1, position: [0, 1.6, 8] }}
        dpr={[1, 1.5]}
        shadows="basic"
      >
        <color args={[area.theme.background]} attach="background" />
        <fog args={[area.theme.background, 9, 30]} attach="fog" />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          intensity={0.8}
          position={[2, 7, 4]}
          shadow-mapSize-height={512}
          shadow-mapSize-width={512}
        />
        <LightFixtures spawnBlacklightActive={blacklightActive} />
        <WallPhotoHook photo={hungLongboiPhoto} />
        <HiddenRoomWallToggle
          active={activeWallSwitchIds.has("hidden-photo-switch")}
        />
        <CameraBattery collected={hasCameraBattery || cameraBatteryInstalled} />
        <LoosePhotoCamera collected={hasCamera || cameraMounted} />
        {tripodPlaced && (
          <PhotoCameraStand
            batteryInstalled={cameraBatteryInstalled}
            cameraMounted={cameraMounted}
          />
        )}
        <PhotoChallenge
          attemptId={photoAttemptId}
          onCountdownChange={setPhotoCountdown}
          onResult={handlePhotoResult}
        />
        <WorkshopDisco active={solvedPuzzleIds.includes("just-dance-wasd")} />
        <LaserPuzzleWorld
          chestOpen={chestOpen}
          installedItemIds={installedItemIds}
          inventoryItemIds={inventoryItemIds}
          laserPowered={laserPowered}
          mirrorOrientations={mirrorOrientations}
        />

        <Suspense fallback={null}>
          <PhotoStudioDecor />
          <Physics gravity={worldGravity}>
            <Building />
            <BasementTrapdoor
              open={openDoorIds.includes("basement-trapdoor")}
            />
            <BasementLadder />
            <TrapdoorCipherClue />
            <TripodCupboard collected={hasTripod || tripodPlaced} />
            <CipherBust />
            <ReadingCorner blacklightActive={blacklightActive} />
            <CaptchaStation solved={solvedPuzzleIds.includes("vase-captcha")} />
            <DanceStation
              solved={solvedPuzzleIds.includes("just-dance-wasd")}
            />
            <FoodScatter eatenFoodIds={eatenFoodIds} />
            <CornArcadeStation
              powered={cornArcadePowered}
              solved={solvedPuzzleIds.includes("corn-chase")}
            />
            <PlayerController
              enabled={!worldPaused}
              onAreaChange={setAreaId}
              slowed={overfull}
            />
            {worldDoors.map((door) => (
              <SlidingDoor
                key={door.id}
                {...door}
                open={openDoorIds.includes(door.id)}
              />
            ))}
            <InteractionSystem
              enabled={!worldPaused}
              interactions={availableInteractions}
              onTargetChange={setTarget}
            />
            <MouseLookController enabled={!worldPaused} />
          </Physics>
        </Suspense>
      </Canvas>

      <WorldHud area={area} target={target} />

      <div className="escape-room-world__inventory">
        <span>Inventar</span>
        <strong>
          {inventoryLabels.length > 0 ? inventoryLabels.join(" · ") : "Tomt"}
        </strong>
      </div>

      {photoCountdown !== null && (
        <div
          aria-live="assertive"
          className="escape-room-world__photo-countdown"
          role="status"
        >
          <strong>{photoCountdown}</strong>
          <span>Still deg foran linsen og se opp</span>
        </div>
      )}

      {photoFlashToken > 0 && (
        <div
          aria-hidden="true"
          className="escape-room-world__photo-flash"
          key={photoFlashToken}
          onAnimationEnd={() => {
            setPhotoFlashToken(0);
          }}
        />
      )}

      {photoResult !== null && (
        <LongboiPhotoModal onClose={closePhotoResult} result={photoResult} />
      )}

      {isCipherPlaqueOpen && <CipherPlaqueModal onClose={closeCipherPlaque} />}

      {isLaserPanelOpen && (
        <LaserPanelModal
          laserPowered={laserPowered}
          onClose={closeLaserPanel}
          onEnterCode={onEnterLaserCode}
        />
      )}

      {isTrapdoorCodeOpen && (
        <TrapdoorCodeModal
          onClose={closeTrapdoorCode}
          onUnlock={unlockTrapdoor}
        />
      )}

      {interactionMessage !== null && (
        <button
          aria-live="polite"
          className="escape-room-world__notice"
          onClick={() => {
            setInteractionMessage(null);
          }}
          type="button"
        >
          {interactionMessage}
        </button>
      )}
      {overfull && (
        <p aria-live="assertive" className="escape-room-world__cc">
          CC: Jeg har spist for mye
        </p>
      )}

      {isPaused && (
        <GameMenu
          onClearMemory={() => {
            clearGameProgress();
            onReset();
          }}
          onResume={() => {
            requestMouseLook();
            setIsPaused(false);
          }}
        />
      )}
    </div>
  );
};

export default EscapeRoomWorld;
