import { atom } from "recoil";

const PlaygroundAtom = atom({
  key: "PLAYGROUND",
  default: {
    elements: [],
  },
});

export default PlaygroundAtom;
