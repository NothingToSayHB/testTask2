<template>
  <main>
    <template v-if="isLoading">
      <div class="center">
        <Loader />
      </div>
    </template>
    <template v-if="isFetchErr">
      <h1 class="text-center">Something went wrong :(</h1>
    </template>
    <template v-if="tracks">
      <section>
        <Card :track="playingTrack" />
      </section>
      <section>
        <Card
          v-for="(track, index) in historyTracks"
          :track="track"
          :key="`history-${index}`"
        />
      </section>
    </template>
  </main>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { TrackData } from "@/types";
import { api } from "@/api";

import Card from "@/components/Card.vue";
import Loader from "@/components/Loader.vue";

export default {
  components: { Card, Loader },
  setup() {
    let tracks = ref<TrackData[] | null>(null);
    const interval = ref<number | null>(null);
    let isFetchErr = ref<Boolean>(false);
    let isLoading = ref<Boolean>(false);

    onMounted(async () => {
      isFetchErr.value = false;
      isLoading.value = true;
      await fetchTracks();
      isLoading.value = false;
      inervalUpdate();
    });

    const inervalUpdate = () => {
      interval.value = setInterval(async () => {
        await updateTracks();
      }, 2000);
    };

    const fetchTracks = async () => {
      try {
        const data = await api.getTracks();
        tracks.value = data;
      } catch (e) {
        isFetchErr.value = true;
      }
    };

    const updateTracks = async () => {
      try {
        const data = await api.getTracks();
        if (tracks.value && data[0].time !== tracks.value[0].time) {
          tracks.value = data;
        }
      } catch (e) {
        isFetchErr.value = true;
      }
    };

    const playingTrack = computed(() =>
      tracks.value?.find((el) => el.status === "playing")
    );
    const historyTracks = computed(() =>
      tracks.value?.filter((el) => el.status !== "playing").reverse()
    );

    onUnmounted(() => {
      clearInterval(interval.value);
    });

    return {
      tracks,
      isLoading,
      playingTrack,
      historyTracks,
      interval,
      inervalUpdate,
      isFetchErr,
    };
  },
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
