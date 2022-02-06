import combineReducer from "./combineReducer";

describe("combineReducer", () => {
  it("is a function", () => {
    expect(combineReducer).toBeInstanceOf(Function);
  });

  it("returns a function", () => {
    expect(combineReducer({})).toBeInstanceOf(Function);
  });

  it("returns a reducer based on the initial state", () => {
    const reducer = combineReducer({
      question: (
        state = "Ultimate Question of Life, the Universe and Everything.",
        action
      ) => state,
      answer: (state = 42, action) => state,
    });
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      question: "Ultimate Question of Life, the Universe and Everything.",
      answer: 42,
    });
  });

  it("calls reducers with properties values", () => {
    const config = {
      increasing: jest.fn((state, action) => state + action.payload),
      decreasing: jest.fn((state, action) => state - action.payload),
    };
    const reducer = combineReducer(config);

    const initialState = {
      increasing: 1000,
      decreasing: 1000,
    };
    const ten = { type: "basic", payload: 10};
    const hundred = { type: "basic", payload: 100 };

    let updatedState = reducer(initialState, ten);

    expect(config.increasing).toHaveBeenCalledWith(1000, ten);
    expect(config.decreasing).toHaveBeenCalledWith(1000, ten);

    expect(updatedState).toEqual({
      increasing: 1010,
      decreasing: 990,
    });

    updatedState = reducer(updatedState, hundred);

    expect(config.increasing).toHaveBeenCalledWith(1010, hundred);
    expect(config.decreasing).toHaveBeenCalledWith(990, hundred);
    expect(updatedState).toEqual({
      increasing: 1110,
      decreasing: 890,
    });
  });
});
