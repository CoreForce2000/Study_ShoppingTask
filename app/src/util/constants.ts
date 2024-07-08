export const IMAGE_BASE_PATH = "/assets/categories/";
export const SLIDE_PATH = "/assets/slides/";
export const BUTTON_PATH = "/assets/buttons/";
export const SOUND_PATH = "/assets/sounds/";
export const ASSETS_PATH = "/assets/";

export const MEMORY_CORRECT_SOUND = new Audio(
  `${SOUND_PATH}Memory correct.mp3`
);
export const MEMORY_WRONG_SOUND = new Audio(`${SOUND_PATH}Memory wrong.mp3`);
export const MEMORY_ALL_CORRECT_SOUND = new Audio(
  `${SOUND_PATH}Memory all correct.wav`
);

export const TIME_IS_RUNNING_OUT_SOUND = new Audio(
  `${SOUND_PATH}Time's up.mp3`
);
export const LUCKY_CUSTOMER_SOUND = new Audio(
  `${SOUND_PATH}Lucky customer.mp3`
);
export const END_SHOPPING_SOUND = new Audio(`${SOUND_PATH}End of phase1.mp3`);

export const RATING_SOUND = new Audio(`${SOUND_PATH}rating_phase_2.mp3`);
export const END_OF_PHASE_TWO_SOUND = new Audio(
  `${SOUND_PATH}End of phase2.mp3`
);

export const KEY_SPACE = " ";

export const COLUMN_NAMES = [
  "Phase",
  "Phase_name",
  "Block_num",
  "Block_name",
  "Trial",
  "Shopping_event",
  "Shopping_category",
  "Shopping_item",
  "Shopping_time_stamp",
  "Shopping_time_action",
  "Shopping_price",
  "Shopping_budget",
  "VAS_shopping_satisfaction",
  "CoDe_cue",
  "CoDe_stimuli_type",
  "CoDe_response",
  "CoDe_outcome",
  "CoDe_item",
  "CoDe_RT",
  "CoDe_VAS",
  "Control_qs_person",
  "Control_qs_item",
  "Control_qs_correct",
  "Control_qs_attempts",
  "Control_qs_RT",
  "Control_event",
  "Control_category",
  "Control_item",
  "Control_time_stamp",
  "Control_time_action",
  "Control_price",
  "Control_budget",
] as const;
