import { createStore } from "redux";

const savedState = localStorage.getItem("reduxState");
const initialState = savedState
  ? JSON.parse(savedState)
  : { sidebarShow: true, user: [], task: [] };
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      const newState = { ...state, ...rest };
      localStorage.setItem("reduxState", JSON.stringify(newState));
      return newState;
    case "addToArray":
      const newUserState = { ...state, user: [...state.user, rest.item] };
      localStorage.setItem("reduxState", JSON.stringify(newUserState));
      return newUserState;
    case "removeFromArray":
      const updatedUserState = {
        ...state,
        user: state.user.filter((item) => item !== rest.item),
      };
      localStorage.setItem("reduxState", JSON.stringify(updatedUserState));
      return updatedUserState;
    case "addTotask":
      const newtaskState = { ...state, task: [...state.task, rest.item] };
      localStorage.setItem("reduxState", JSON.stringify(newtaskState));
      return newtaskState;
    case "removeFromtask":
      const updatedtaskState = {
        ...state,
        task: [],
      };
      localStorage.setItem("reduxState", JSON.stringify(updatedtaskState));
      return updatedtaskState;
    default:
      return state;
  }
};

const store = createStore(changeState, initialState);

export default store;
