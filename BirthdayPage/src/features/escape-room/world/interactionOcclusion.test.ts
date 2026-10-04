import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector3,
} from "three";
import { describe, expect, it } from "vitest";
import {
  cipherPlaqueInteraction,
  hiddenRoomSwitchInteraction,
  worldInteractions,
  worldWalls,
} from "./worldConfig";
import {
  getInteractionTargetSignature,
  interactionOccluderKey,
  isInteractionOccluded,
} from "./interactionOcclusion";

const addBox = (
  root: Group,
  position: [number, number, number],
  blocksInteraction: boolean,
) => {
  const mesh = new Mesh(new BoxGeometry(0.4, 2, 2), new MeshBasicMaterial());
  mesh.position.set(...position);
  if (blocksInteraction) mesh.userData[interactionOccluderKey] = true;
  root.add(mesh);
};

describe("isInteractionOccluded", () => {
  const origin = new Vector3(0, 1, 0);
  const target = new Vector3(3, 1, 0);

  it("blocks a target behind a wall", () => {
    const root = new Group();
    addBox(root, [1.5, 1, 0], true);
    root.updateMatrixWorld(true);

    expect(isInteractionOccluded(new Raycaster(), root, origin, target)).toBe(
      true,
    );
  });

  it("allows a target when the intervening object is not an occluder", () => {
    const root = new Group();
    addBox(root, [1.5, 1, 0], false);
    root.updateMatrixWorld(true);

    expect(isInteractionOccluded(new Raycaster(), root, origin, target)).toBe(
      false,
    );
  });

  it("allows a target after a door's blocking marker is removed", () => {
    const root = new Group();
    addBox(root, [1.5, 1, 0], true);
    root.updateMatrixWorld(true);
    const door = root.children[0];

    expect(isInteractionOccluded(new Raycaster(), root, origin, target)).toBe(
      true,
    );

    door.userData[interactionOccluderKey] = false;

    expect(isInteractionOccluded(new Raycaster(), root, origin, target)).toBe(
      false,
    );
  });
});

describe("getInteractionTargetSignature", () => {
  it("changes when a dynamic interaction keeps its ID but gets a new label", () => {
    const target = {
      action: { puzzleId: "corn-chase", type: "open-puzzle" } as const,
      id: "corn-arcade",
      label: "Plug in the arcade",
      position: [1, 1, 1] as const,
    };

    const before = getInteractionTargetSignature(target);
    const after = getInteractionTargetSignature({
      ...target,
      label: "Play the arcade",
    });

    expect(after).not.toBe(before);
  });
});

describe("the configured room layout", () => {
  const configuredWalls = () => {
    const root = new Group();
    for (const wall of worldWalls) {
      const mesh = new Mesh(
        new BoxGeometry(wall.size[0], wall.size[1], wall.size[2]),
        new MeshBasicMaterial(),
      );
      mesh.position.set(wall.position[0], wall.position[1], wall.position[2]);
      mesh.userData[interactionOccluderKey] = true;
      root.add(mesh);
    }
    root.updateMatrixWorld(true);
    return root;
  };

  it("blocks the archive plaque from the gallery side of its wall", () => {
    expect(
      isInteractionOccluded(
        new Raycaster(),
        configuredWalls(),
        new Vector3(-3, 1.6, 2.65),
        new Vector3(...cipherPlaqueInteraction.position),
      ),
    ).toBe(true);
  });

  it("keeps the archive-door prompt reachable from the gallery", () => {
    const archiveDoor = worldInteractions.find(
      (interaction) => interaction.id === "open-archive-door",
    );
    expect(archiveDoor).toBeDefined();
    if (archiveDoor === undefined) throw new Error("Archive door is missing");
    expect(
      isInteractionOccluded(
        new Raycaster(),
        configuredWalls(),
        new Vector3(-2, 1.6, 0),
        new Vector3(...archiveDoor.position),
      ),
    ).toBe(false);
  });

  it("keeps the hidden painting passage open to the switch", () => {
    expect(
      isInteractionOccluded(
        new Raycaster(),
        configuredWalls(),
        new Vector3(-8.5, 1.6, 7.5),
        new Vector3(...hiddenRoomSwitchInteraction.position),
      ),
    ).toBe(false);
  });
});
