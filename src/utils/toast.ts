export const errorMsg = (error: Error | string | any) => {
  console.error(error);
  if (typeof error?.response?.data?.message == "string")
    return error?.response?.data?.message;
  else if (typeof error?.message == "string") return error?.message;
  else if (typeof error == "string") return error;
  else return "ERROR";
};

export const successMg = (success: any) => {
  if (typeof success?.data?.message == "string") return success?.data?.message;
  else if (typeof success?.message == "string") return success?.message;
  else if (typeof success == "string") return success;
};
