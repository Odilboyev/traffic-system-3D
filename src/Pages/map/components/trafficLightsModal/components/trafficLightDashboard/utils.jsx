import {
  TbArrowBackUp,
  TbArrowLeft,
  TbArrowRampLeft,
  TbArrowRampRight,
  TbArrowRight,
  TbArrowUp,
} from "react-icons/tb";

// Add modal size multiplier
const MODAL_SIZE_MULTIPLIER = 0.6;

export const iconOptions = [
  { name: "Right Ramp", icon: <TbArrowRampRight />, value: "TbArrowRampRight" },
  { name: "Left Ramp", icon: <TbArrowRampLeft />, value: "TbArrowRampLeft" },
  { name: "Right Arrow", icon: <TbArrowRight />, value: "TbArrowRight" },
  { name: "Left Arrow", icon: <TbArrowLeft />, value: "TbArrowLeft" },
  { name: "Arrow Up", icon: <TbArrowUp />, value: "TbArrowUp" },
  {
    name: "Arrow Back Up",
    icon: <TbArrowBackUp className="-rotate-90" />,
    value: "TbArrowBackUp",
  },
];

// export const getLaneWidth = (isInModal = false) =>
//   isInModal ? Math.floor(40 * MODAL_SIZE_MULTIPLIER) : 40;

// export const getCrosswalkWidth = (isInModal = false) =>
//   isInModal ? Math.floor(20 * MODAL_SIZE_MULTIPLIER) : 20;

export const getLaneWidth = () => 40;

export const getCrosswalkWidth = () => 20;

export const getRoadWidth = (roadConfig, isInModal = false) => {
  return (
    (roadConfig.lanesLeft.length + roadConfig.lanesRight.length) *
    getLaneWidth(isInModal)
  );
};

export const getIntersectionSize = (config, isInModal = false) => {
  // Calculate the width needed for each direction
  const calculateRoadWidth = (roadConfig) => {
    if (!roadConfig.visible) return 0;
    const totalLanes =
      roadConfig.lanesLeft.length + roadConfig.lanesRight.length;
    return totalLanes * getLaneWidth(isInModal);
  };

  // Get widths for all directions
  const northWidth = calculateRoadWidth(config.north);
  const southWidth = calculateRoadWidth(config.south);
  const eastWidth = calculateRoadWidth(config.east);
  const westWidth = calculateRoadWidth(config.west);

  // Calculate lane differences and asymmetry
  const verticalDiff = Math.abs(northWidth - southWidth);
  const horizontalDiff = Math.abs(eastWidth - westWidth);

  // Calculate lane distribution asymmetry within each road
  const calculateAsymmetry = (roadConfig) => {
    if (!roadConfig.visible) return 0;
    return Math.abs(roadConfig.lanesLeft.length - roadConfig.lanesRight.length);
  };

  const northAsymmetry = calculateAsymmetry(config.north);
  const southAsymmetry = calculateAsymmetry(config.south);
  const eastAsymmetry = calculateAsymmetry(config.east);
  const westAsymmetry = calculateAsymmetry(config.west);

  // Use the maximum width between opposing directions
  const verticalWidth = Math.max(northWidth, southWidth);
  const horizontalWidth = Math.max(eastWidth, westWidth);
  const baseSize = Math.max(verticalWidth, horizontalWidth);

  // Calculate dynamic padding factor
  let paddingFactor = 1.25; // Start with minimum padding

  // Adjust for width differences between opposing roads
  const maxDiff =
    Math.max(verticalDiff, horizontalDiff) / getLaneWidth(isInModal);
  if (maxDiff > 0) {
    paddingFactor += maxDiff * 0.03;
  }

  // Adjust for lane distribution asymmetry
  const maxAsymmetry = Math.max(
    northAsymmetry,
    southAsymmetry,
    eastAsymmetry,
    westAsymmetry
  );
  if (maxAsymmetry > 1) {
    paddingFactor += maxAsymmetry * 0.02;
  }

  // Adjust for total road width
  const maxWidth =
    Math.max(verticalWidth, horizontalWidth) / getLaneWidth(isInModal);
  if (maxWidth > 6) {
    paddingFactor += 0.05;
  }

  // Cap the padding factor
  paddingFactor = Math.min(Math.max(paddingFactor, 1.25), 1.4);

  return Math.ceil(baseSize * paddingFactor);
};

export const defaultConfig = {
  east: {
    visible: true,
    direction: "horizontal",
    lanesLeft: [[], [], [], []],
    cross_walkLeft: {
      channel_id: 12,
    },
    cross_walkRight: {
      channel_id: 12,
    },
    lanesRight: [
      {
        icon: "TbArrowLeft",
        channel_id: 2,
      },
      {
        icon: "TbArrowLeft",
        channel_id: 2,
      },
      {
        icon: "TbArrowUp",
        channel_id: 5,
      },
      {
        icon: "TbArrowUp",
        channel_id: 5,
      },
      {
        icon: "TbArrowUp",
        channel_id: 5,
      },
      {
        icon: "TbArrowRight",
        channel_id: 5,
      },
    ],
  },
  west: {
    visible: true,
    direction: "horizontal",
    lanesLeft: [{}, {}, {}, {}],
    cross_walkLeft: {
      channel_id: 3,
    },
    cross_walkRight: {
      channel_id: 3,
    },
    lanesRight: [
      {
        icon: "TbArrowLeft",
        channel_id: 3,
      },
      {
        icon: "TbArrowLeft",
        channel_id: 3,
      },
      {
        icon: "TbArrowUp",
        channel_id: 1,
      },
      {
        icon: "TbArrowUp",
        channel_id: 1,
      },
      {
        icon: "TbArrowUp",
        channel_id: 1,
      },
      {
        icon: "TbArrowRampRight",
        channel_id: 1,
      },
    ],
  },
  angle: 0,
  north: {
    visible: true,
    direction: "vertical",
    lanesLeft: [{}, {}, {}, {}],
    cross_walkLeft: {
      channel_id: 8,
    },
    cross_walkRight: {
      channel_id: 8,
    },
    lanesRight: [
      {
        icon: "TbArrowRampLeft",
        channel_id: 6,
      },
      {
        icon: "TbArrowUp",
        channel_id: 6,
      },
      {
        icon: "TbArrowRight",
        channel_id: 6,
      },
    ],
  },
  south: {
    visible: true,
    direction: "vertical",
    lanesLeft: [[], [], [], []],
    cross_walkLeft: {
      channel_id: 4,
    },
    cross_walkRight: {
      channel_id: 4,
    },
    lanesRight: [
      {
        icon: "TbArrowRampLeft",
        channel_id: 14,
      },
      {
        icon: "TbArrowUp",
        channel_id: 14,
      },
      {
        icon: "TbArrowUp",
        channel_id: 14,
      },
      {
        icon: "TbArrowRight",
        channel_id: 9,
      },
    ],
  },
};

export const updateTrafficStates = (config, channelStatuses) => {
  const newTrafficLights = {};
  const newSeconds = {};
  const newCrosswalks = {};
  const newCrosswalkSeconds = {};

  Object.entries(config).forEach(([direction, dirConfig]) => {
    if (direction !== "angle") {
      // Handle traffic light updates
      if (dirConfig.lanesRight.length > 0) {
        const firstChannelId = dirConfig.lanesRight[0].channel_id;
        if (firstChannelId && channelStatuses[firstChannelId]) {
          const status = channelStatuses[firstChannelId].status;
          newTrafficLights[direction] =
            status === 1
              ? "green"
              : status === 9 || status === 3
              ? "yellow"
              : "red";
        }
        // Countdown for each lane in lanesRight
        newSeconds[direction] = {};
        dirConfig.lanesRight.forEach((lane) => {
          if (lane.channel_id && channelStatuses[lane.channel_id]) {
            newSeconds[direction][lane.channel_id] =
              channelStatuses[lane.channel_id].countdown;
          }
        });
      }

      // Handle left lanes (similar structure)
      dirConfig.lanesLeft.forEach((lane) => {
        if (lane.channel_id && channelStatuses[lane.channel_id]) {
          if (!newSeconds[direction]) newSeconds[direction] = {};
          newSeconds[direction][lane.channel_id] =
            channelStatuses[lane.channel_id].countdown;
        }
      });

      // Handle crosswalk updates
      ["cross_walkLeft", "cross_walkRight"].forEach((crosswalkType) => {
        const channelId = dirConfig[crosswalkType]?.channel_id;
        newCrosswalks[direction] = newCrosswalks[direction] || {};
        newCrosswalkSeconds[direction] = newCrosswalkSeconds[direction] || {};

        if (channelId && channelStatuses[channelId]) {
          const status = channelStatuses[channelId].status;
          const countdown = channelStatuses[channelId].countdown;

          newCrosswalks[direction][
            crosswalkType === "cross_walkLeft" ? "left" : "right"
          ] = status === 1 ? "green" : "red";

          newCrosswalkSeconds[direction][
            crosswalkType === "cross_walkLeft" ? "left" : "right"
          ] = countdown;
        } else {
          newCrosswalkSeconds[direction][
            crosswalkType === "cross_walkLeft" ? "left" : "right"
          ] = 0; // Default value for missing data
        }
      });
    }
  });

  return {
    newTrafficLights,
    newSeconds,
    newCrosswalks,
    newCrosswalkSeconds,
  };
};
