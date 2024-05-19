import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Phase = number; // int
type PhaseName = "Shopping" | "CoDe" | "Control"; // string
type BlockNum = number; // int
type BlockName = "Shopping" | "questions" | "p(0|-A)=0" | "p(0|-A)=0.3" | "p(0|-A)=0.6" | "p(0|-A)=0";
// type ShoppingEvent = "open category" | "select item" | "back" | "check trolley" | "select item trolley" | "remove";
type ShoppingEvent = string;
type ShoppingCategory = string | undefined; // Assuming category_names is a list of strings
type ShoppingItem = string | undefined; // Assuming item_names is a list of strings
type ShoppingTimestamp = number; // datetime(mm:ss)
type ShoppingTimeAction = number; // datetime(ms)
type ShoppingPrice = number | undefined; // int
type ShoppingBudget = number; // int
type CoDeCue = "blue" | "orange"; // string
type CoDeStimuliType = "own" | "others"; // string
type CoDeResponse = "TRUE" | "FALSE"; // string
type CoDeOutcome = "TRUE" | "FALSE"; // string
type CoDeItem = string; // Assuming item_names is a list of strings
type CoDeRT = number; // int
type CoDeVAS = number | undefined; // int, range (1, 100)
type ControlQsPerson = string
type ControlQsItem = string; // Assuming item_names is a list of strings
type ControlQsCorrect = "TRUE" | "FALSE"; // string
type ControlQsAttempts = number; // int
type ControlQsRT = number; // int

interface Row {
    Phase: Phase;
    Phase_name: PhaseName;
    Block_num: BlockNum;
    Block_name: BlockName;

    Shopping_event?: ShoppingEvent;
    Shopping_category?: ShoppingCategory;
    Shopping_item?: ShoppingItem;
    Shopping_time_stamp?: ShoppingTimestamp;
    Shopping_time_action?: ShoppingTimeAction;
    Shopping_price?: ShoppingPrice;
    Shopping_budget?: ShoppingBudget;

    CoDe_cue?: CoDeCue;
    CoDe_stimuli_type?: CoDeStimuliType;
    CoDe_response?: CoDeResponse;
    CoDe_outcome?: CoDeOutcome;
    CoDe_item?: CoDeItem;
    CoDe_RT?: CoDeRT;
    CoDe_VAS?: CoDeVAS;

    Control_qs_person?: ControlQsPerson;
    Control_qs_item?: ControlQsItem;
    Control_qs_correct?: ControlQsCorrect;
    Control_qs_attempts?: ControlQsAttempts;
    Control_qs_RT?: ControlQsRT;
  }
  
  

export const dataSlice = createSlice({
    name: "data",
    initialState: {
        phase:1,
        phaseName: "Shopping" as PhaseName,
        block:1,
        blockName: "Shopping" as BlockName,
        rows: [] as Row[],
    },
    
    reducers: {

        setPhase: (state, action) => {
            state.phase = action.payload;
        },
        setPhaseName: (state, action) => {
            state.phaseName = action.payload;
        },
        setBlock: (state, action) => {
            state.block = action.payload;
        },
        setBlockName: (state, action) => {
            state.blockName = action.payload;
        },
        logShopAction: (state, action: PayloadAction<{ Shopping_event: ShoppingEvent; Shopping_category: ShoppingCategory; Shopping_item: ShoppingItem; Shopping_price:ShoppingPrice, Shopping_budget: ShoppingBudget }>) => {
            const { Shopping_event, Shopping_category, Shopping_item, Shopping_price, Shopping_budget } = action.payload;

            const currentTime = new Date().getTime();

            const shopAction: Row = {
                Phase: state.phase,
                Phase_name: state.phaseName,
                Block_num: state.block,
                Block_name: state.blockName,
                Shopping_event: Shopping_event,
                Shopping_category: Shopping_category,
                Shopping_item: Shopping_item,
                Shopping_time_stamp: currentTime,
                Shopping_time_action: state.rows.length? (currentTime - state.rows[state.rows.length - 1].Shopping_time_stamp!) : 0,
                Shopping_price: Shopping_price,
                Shopping_budget: Shopping_budget,
            }
      
            state.rows.push(shopAction);
  
            console.log("Shop Action logged", shopAction);
        },
        logExperimentAction: (
            state,
            action: PayloadAction<{
                CoDe_cue: CoDeCue;
                CoDe_stimuli_type: CoDeStimuliType;
                CoDe_response: CoDeResponse;
                CoDe_outcome: CoDeOutcome;
                CoDe_item: CoDeItem;
                CoDe_RT: CoDeRT;
                CoDe_VAS: CoDeVAS;
            }>
          ) => {
            const { CoDe_cue, CoDe_stimuli_type, CoDe_response, CoDe_outcome, CoDe_item, CoDe_RT, CoDe_VAS } = action.payload;
      
            // Create the ShopAction object with budget, timer, and other parameters
            const row: Row = {
                Phase: state.phase,
                Phase_name: state.phaseName,
                Block_num: state.block,
                Block_name: state.blockName,
            
                CoDe_cue: CoDe_cue,
                CoDe_stimuli_type: CoDe_stimuli_type,
                CoDe_response: CoDe_response,
                CoDe_outcome: CoDe_outcome,
                CoDe_item: CoDe_item,
                CoDe_RT: CoDe_RT,
                CoDe_VAS: CoDe_VAS,
              }
      
            state.rows.push(row);
  
            console.log("Experiment Action logged", row);
        },

        logControlAction: (
            state,
            action: PayloadAction<{
                Control_qs_person: ControlQsPerson;
                Control_qs_item: ControlQsItem;
                Control_qs_correct: ControlQsCorrect;
                Control_qs_attempts: ControlQsAttempts;
                Control_qs_RT: ControlQsRT;
            }>
          ) => {
            const { Control_qs_person, Control_qs_item, Control_qs_correct, Control_qs_attempts, Control_qs_RT } = action.payload;
      
            // Create the ShopAction object with budget, timer, and other parameters
            const row: Row = {
                Phase: state.phase,
                Phase_name: state.phaseName,
                Block_num: state.block,
                Block_name: state.blockName,
                Control_qs_person: Control_qs_person,
                Control_qs_item: Control_qs_item,
                Control_qs_correct: Control_qs_correct,
                Control_qs_attempts: Control_qs_attempts,
                Control_qs_RT: Control_qs_RT,
              }
      
            state.rows.push(row);
  
            console.log("Control Action logged", row);
        }

    },
});


export const { 
    setPhaseName,
    setPhase,
    setBlockName,
    setBlock,
    logShopAction,
    logExperimentAction,
    logControlAction
    
} = dataSlice.actions;

export default dataSlice.reducer;