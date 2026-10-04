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
import {
  createLongboiPhotoDeck,
  drawLongboiPhoto,
  failedLongboiPhotos,
  longboiPhotoItemIds,
  successfulLongboiPhotos,
  type SuccessfulLongboiPhoto,
} from "../puzzles/longboiPhotos";
import type {
  ItemId,
  MirrorItemId,
  MirrorOrientations,
  PuzzleId,
} from "../state/gameTypes";
import Building from "./Building";
import CameraVendingMachine from "./CameraVendingMachine";
import CameraVendingModal from "./CameraVendingModal";
import {
  getCameraTokenBalance,
  tokenPuzzles,
  type CameraRewardId,
} from "../puzzles/cameraRewards";
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
import MouseLookController from "./MouseLookController";
import PhotoChallenge from "./PhotoChallenge";
import PhotoCameraStand from "./PhotoCameraStand";
import PhotoStudioDecor from "./PhotoStudioDecor";
import PlayerController from "./PlayerController";
import ReadingCorner from "./ReadingCorner";
import SlidingDoor from "./SlidingDoor";
import SlidingTilesStation from "./SlidingTilesStation";
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
  onRedeemCameraReward: (itemId: CameraRewardId) => void;
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
  onRedeemCameraReward,
  onRotateMirror,
  onSolvePuzzle,
  solvedPuzzleIds,
}: EscapeRoomWorldProps) => {
  const [areaId, setAreaId] = useState<AreaId>(defaultAreaId);
  const [isPaused, setIsPaused] = useState(false);
  const [isCameraVendingOpen, setIsCameraVendingOpen] = useState(false);
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
  const [collectedLongboiPhotos, setCollectedLongboiPhotos] = useState<
    Partial<
      Record<(typeof longboiPhotoItemIds)[number], SuccessfulLongboiPhoto>
    >
  >({});
  const successfulPhotoDeck = useRef(
    createLongboiPhotoDeck<(typeof successfulLongboiPhotos)[number]>(),
  );
  const failedPhotoDeck = useRef(
    createLongboiPhotoDeck<(typeof failedLongboiPhotos)[number]>(),
  );
  const wasPointerLocked = useRef(document.pointerLockElement !== null);
  const suppressMenuOnUnlock = useRef(false);
  const interactionKeyGate = useRef(createInteractionKeyGate());
  const area = getArea(areaId);
  const worldPaused =
    isPaused ||
    isCameraVendingOpen ||
    isCipherPlaqueOpen ||
    isLaserPanelOpen ||
    isTrapdoorCodeOpen ||
    activePuzzleOpen ||
    photoResult !== null;
  const hasCamera = inventoryItemIds.includes("camera");
  const hasCameraBattery = inventoryItemIds.includes("camera-battery");
  const hasTripod = inventoryItemIds.includes("tripod");
  const hasLongboiPhoto = longboiPhotoItemIds.some((itemId) =>
    inventoryItemIds.includes(itemId),
  );
  const cameraMounted = installedItemIds.includes("camera");
  const cameraBatteryInstalled = installedItemIds.includes("camera-battery");
  const tripodPlaced = installedItemIds.includes("tripod");
  const hungPhotoItemId = longboiPhotoItemIds.find((itemId) =>
    installedItemIds.includes(itemId),
  );
  const hungLongboiPhoto =
    hungPhotoItemId === undefined
      ? null
      : (collectedLongboiPhotos[hungPhotoItemId] ?? successfulLongboiPhotos[0]);
  const blacklightActive = isSpawnBlacklightActive(
    activeWallSwitchIds,
    installedItemIds,
  );
  const mirrorInventoryCount = (
    ["mirror-1", "mirror-2", "mirror-3"] as const
  ).filter((itemId) => inventoryItemIds.includes(itemId)).length;
  const tokenBalance = getCameraTokenBalance({
    solvedPuzzles: [...solvedPuzzleIds],
    inventory: [...inventoryItemIds],
    installedItems: [...installedItemIds],
  });
  const previousTokenCount = useRef(0);
  const earnedTokenCount = tokenPuzzles.filter(({ puzzleId }) =>
    solvedPuzzleIds.includes(puzzleId),
  ).length;
  useEffect(() => {
    if (earnedTokenCount > previousTokenCount.current) {
      setInteractionMessage("Du har vunnet en pollett!");
    }
    previousTokenCount.current = earnedTokenCount;
  }, [earnedTokenCount]);
  const inventoryLabels = [
    `Polletter: ${String(tokenBalance)}`,

    hasCamera ? "Kamera" : null,
    hasCameraBattery ? "Kamerabatteri" : null,
    hasTripod ? "Kamerastativ" : null,
    hasLongboiPhoto ? "Longboi-bilde" : null,
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
        if (
          action.type === "open-puzzle" &&
          solvedPuzzleIds.includes(action.puzzleId)
        ) {
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
              label: "Undersøk bildekroken",
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
          return [
            {
              ...interaction,
              label: installed ? "Drei speilet" : "Undersøk sokkelen",
            },
          ];
        }

        if (action.type !== "start-photo") {
          return [interaction];
        }

        return [
          {
            ...interaction,
            label: !tripodPlaced
              ? "Undersøk merket på gulvet"
              : !cameraMounted
                ? "Undersøk stativet"
                : !cameraBatteryInstalled
                  ? "Undersøk kameraet"
                  : "Ta et bilde",
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
      hungLongboiPhoto,
      installedItemIds,
      inventoryItemIds,
      laserPowered,
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
        const draw = drawLongboiPhoto(
          successfulLongboiPhotos,
          successfulPhotoDeck.current,
        );
        successfulPhotoDeck.current = draw.deck;
        const nextPhoto = draw.photo;
        const rewardItemId = longboiPhotoItemIds.find(
          (itemId) =>
            !inventoryItemIds.includes(itemId) &&
            !installedItemIds.includes(itemId),
        );
        if (rewardItemId !== undefined) {
          setCollectedLongboiPhotos((current) => ({
            ...current,
            [rewardItemId]: nextPhoto,
          }));
          onPickUpItem(rewardItemId);
        }
        setPhotoResult({
          details:
            rewardItemId === undefined
              ? "Godkjent! Ta gjerne flere bilder for å se flere Longboi-øyeblikk."
              : "Godkjent! Bildet er lagt i inventaret.",
          photo: nextPhoto,
          savedToInventory: rewardItemId !== undefined,
        });

        if (rewardItemId !== undefined) {
          onSolvePuzzle("photo-timer");
        }
        return;
      }

      const draw = drawLongboiPhoto(
        failedLongboiPhotos,
        failedPhotoDeck.current,
      );
      failedPhotoDeck.current = draw.deck;

      setPhotoResult({
        details: "Bildet ble ikke godkjent.",
        photo: draw.photo,
        savedToInventory: false,
      });
    },
    [installedItemIds, inventoryItemIds, onPickUpItem, onSolvePuzzle],
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
        if (photoCountdown !== null) {
          setInteractionMessage("Vent til kameraet har tatt bildet.");
          return;
        }
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
                : "Veggbryteren klikker på."
              : "Veggbryteren klikker av.",
          );
        } else if (target.action.type === "hang-longboi-photo") {
          const photoItemId = longboiPhotoItemIds.find((itemId) =>
            inventoryItemIds.includes(itemId),
          );

          if (photoItemId === undefined) {
            setInteractionMessage("En tom bildekrok.");
            return;
          }

          onInstallItem(photoItemId);
          setInteractionMessage(
            activeWallSwitchIds.has("hidden-photo-switch")
              ? "Bildet trekker kroken ned. Et svakt klikk høres."
              : "Bildet trekker kroken ned.",
          );
        } else if (target.action.type === "inspect-cipher-plaque") {
          if (document.pointerLockElement !== null) {
            suppressMenuOnUnlock.current = true;
          }
          setIsCipherPlaqueOpen(true);
          releaseMouseLook();
        } else if (target.action.type === "open-camera-vending") {
          if (document.pointerLockElement !== null)
            suppressMenuOnUnlock.current = true;
          setIsCameraVendingOpen(true);
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
                : "Speilet dreies.",
            );
          } else if (inventoryItemIds.includes(itemId)) {
            onInstallItem(itemId);
            setInteractionMessage("Speilet er festet.");
          } else {
            setInteractionMessage("En tom sokkel.");
          }
        } else if (target.action.type === "collect-pepsi") {
          if (!chestOpen) return;
          setInteractionMessage("Pepsi Max funnet. Oppdraget er fullført!");
          onCollectPepsi();
        } else {
          if (!tripodPlaced) {
            if (hasTripod) {
              onInstallItem("tripod");
              setInteractionMessage("Stativet er satt på plass.");
            } else {
              setInteractionMessage("Et merke på gulvet.");
            }
            return;
          }
          if (!cameraMounted) {
            if (hasCamera) {
              onInstallItem("camera");
              setInteractionMessage("Kameraet er montert på stativet.");
            } else {
              setInteractionMessage("Et tomt stativ.");
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
              setInteractionMessage("Kameraet slår seg ikke på.");
            }
            return;
          }
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
          paused={worldPaused}
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
            <CameraVendingMachine />
            <CipherBust />
            <ReadingCorner blacklightActive={blacklightActive} />
            <CaptchaStation solved={solvedPuzzleIds.includes("vase-captcha")} />
            <SlidingTilesStation
              solved={solvedPuzzleIds.includes("brita-sliding-tiles")}
            />
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

      <WorldHud target={target} />

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

      {isCameraVendingOpen && (
        <CameraVendingModal
          tokenBalance={tokenBalance}
          ownedItems={[...inventoryItemIds, ...installedItemIds]}
          onRedeem={onRedeemCameraReward}
          onClose={() => {
            setIsCameraVendingOpen(false);
            requestMouseLook();
          }}
        />
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
          Jeg har spist for mye
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
