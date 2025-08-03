export const sleep = (ms: number, props: { when: boolean } = { when: true }) => {
  return new Promise((resolve) => setTimeout(resolve, props.when ? ms : 0));
};
