<template>
  <article class="track" v-if="track">
    <div class="track__info">
      <h2>{{ track.title }}</h2>
      <div class="track__info--executor">
        <p>{{ track.artist }}</p>
        <small>{{ track.status }}</small>
      </div>
    </div>
    <div class="track__view">
      <div class="track__view--image">
        <img :src="track.imageUrl" alt="image" />
        <small>{{ track.time }}</small>
      </div>
      {{ track.duration }}
      <p class="text-center">
        {{ track.status === "playing" ? timer : track.duration }}
      </p>
    </div>
    <progress
      v-if="track.status === 'playing'"
      :max="secondsOfTrack"
      :value="progress"
    ></progress>
  </article>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { convertToSeconds, timeTracker } from "@/utils/utils";

export default {
  props: ["track"],

  setup(props) {
    const progress = ref(0);
    const progressInterval = ref<number | null>(null);
    let timer = ref<string>("");
    let iterableForTimer = ref<number>(0);

    onMounted(() => {
      if (props.track.status === "playing") {
        addProgress();
      }
    });

    const addProgress = () => {
      progressInterval.value = setInterval(() => {
        if (progress.value <= secondsOfTrack.value) {
          progress.value++;
        } else {
          clearInterval(progressInterval.value);
        }

        if (iterableForTimer.value >= secondsOfTrack.value) {
          clearInterval(progressInterval.value);
        } else {
          timer.value = timeTracker(
            secondsOfTrack.value - iterableForTimer.value
          );
        }

        iterableForTimer.value += 1;
      }, 1000);
    };

    watch(
      () => props.track,
      () => {
        progress.value = 0;
        timer.value = timeTracker(0);
        iterableForTimer.value = 0;
        clearInterval(progressInterval.value);
        addProgress();
      }
    );

    const secondsOfTrack = computed(() =>
      convertToSeconds(props.track.duration)
    );

    onUnmounted(() => {
      clearInterval(progressInterval.value);
    });

    return {
      secondsOfTrack,
      progress,
      timer,
      addProgress,
    };
  },
};
</script>

<style lang="scss" scoped>
progress {
  width: 100%;
}

.track {
  background-color: gray;
  border-radius: 0.2rem;
  padding: 0.5rem;
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #fff;
  &__info {
    display: flex;
    justify-content: space-between;
  }
  &__view {
    &--image {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    img {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
