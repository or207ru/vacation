export const userReducer = (state = {}, action) => {
    switch (action.type) {
      case 'LOGIN':
        return action.payload
      case 'LOGOUT':
        return {}
      default:
        return state
    }
  }
  
  export const vacationsReducer = (state = [], action) => {
    switch (action.type) {
      case 'GETIN':
        return action.payload
      case 'LOGOUT':
        return []
      default:
        return state
    }
  }
  