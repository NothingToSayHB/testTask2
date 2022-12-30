export const convertToSeconds = (str: string): number => {
  let h = Number(str.split(":")[0]);
  let m = Number(str.split(":")[1]);
  let s = Number(str.split(":")[2]);

  let result = h * 360 + m * 60 + s;

  return result;
};

export const convertSecToTime = (
  seconds: number
): { h: number; m: number; s: number } => {
  let h = Math.floor(seconds / (60 * 60));
  if (h < 10) {
    h = "0" + h.toString();
  } else {
    h = h.toString();
  }
  let d_m = seconds % (60 * 60);
  let m = Math.floor(d_m / 60);
  m = m.toString();
  let d_s = d_m % 60;
  let s = Math.ceil(d_s);
  if (s < 10) {
    s = "0" + s.toString();
  } else {
    s = s.toString();
  }
  return {
    h,
    m,
    s,
  };
};

export function timeTracker(seconds: number): string {
  let converted = convertSecToTime(seconds);

  if (converted.s > 0) {
    --converted.s;
  }
  if (converted.m > 0 && converted.s < 0) {
    converted.s = 59;
    --converted.m;
  }
  if (converted.h > 0 && converted.m < 0) {
    converted.m = 59;
    --converted.h;
  }

  if (converted.s < 10) {
    converted.s = "0" + converted.s;
  }

  if (converted.m < 10) {
    converted.m = "0" + converted.m;
  }

  if (converted.h < 10) {
    converted.h = "0" + converted.h;
  }

  if (converted.h == 0) {
    converted.h = "00";
  }

  if (converted.s == 0) {
    converted.s = "00";
  }

  if (converted.m == 0) {
    converted.m = "00";
  }

  return `${converted.h}:${converted.m}:${converted.s}`;
}
