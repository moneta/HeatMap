const initialState = {
  zoom: 11,
  // San Francisco, by default
  center: {
    lat: 37.774929,
    lng: -122.419416,
  },
};

export default function heat(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}