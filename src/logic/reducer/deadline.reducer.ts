import { DECREMENT_DEADLINE, INCREMENT_DEADLINE } from "../action/actiontype"

export const deadlineReducer = (state = 15, action: any) => {
  const { type } = action
  switch (type) {
    case INCREMENT_DEADLINE:
      return state < 60 ? state + 15 : state
    case DECREMENT_DEADLINE:
      return state > 15 ?  state - 15 : state
    default:
      return state
  }
}
