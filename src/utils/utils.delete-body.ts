export const deleteBody = () => {
  const body = {
    isDeleted: true,
    deletedAt: Date.now(),
    updatedAt: Date.now(),
  };

  return body;
};
