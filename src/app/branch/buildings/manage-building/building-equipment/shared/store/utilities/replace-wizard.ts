export const addRegisterFile = (state: any, registerId: string, file: any) => {
  const s = {...state};

  s[registerId] = {
    file: file
  };

  return s;
};

