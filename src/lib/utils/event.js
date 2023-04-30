export const onChange = (setter) => (e) => {
  const {
    target: { value },
  } = e;
  setter(value);
};
