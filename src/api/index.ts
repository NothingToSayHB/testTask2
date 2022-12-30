import axios from "axios";
import type { TrackData } from "@/types";

const config = axios.create({
  baseURL: "https://onair.radioapi.io",
});

export const api = {
  async getTracks(): Promise<TrackData[]> {
    try {
      const {
        data: { nowplaying },
      } = await config.get("/thisisgo/go/onair.json");
      return nowplaying;
    } catch (e) {
      throw e;
    }
  },
};
