import { createStore } from "vuex";

export default createStore({
  state: {
    dateRange: [],
    selectedSong: {},
    selectedGenre: "hip hop",
  },
  getters: {
    dateRange(state) {
      return state.dateRange;
    },
    selectedSong(state) {
      return state.selectedSong;
    },
    selectedGenre(state) {
      return state.selectedGenre;
    },
  },
  mutations: {
    updateDateRange(state, dateRange) {
      state.dateRange = dateRange;
    },
    updateSelectedSong(state, newV) {
      state.selectedSong = newV;
    },
    updateSelectedGenre(state, newV) {
      state.selectedGenre = newV;
    },
  },
  actions: {
    updateDateRange(context, dateRange) {
      context.commit("updateDateRange", dateRange);
    },
    updateSelectedSong(context, newV) {
      context.commit("updateSelectedSong", newV);
      context.commit("updateSelectedGenre", newV.genre);
    },
  },
  modules: {},
});
