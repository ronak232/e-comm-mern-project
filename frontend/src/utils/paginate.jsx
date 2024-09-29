function paginate(dataShow) {
  const itemPerPage = 10; // Items per page to visible in pagination
  const totalPagesNumber = Math.ceil(dataShow?.length / itemPerPage); // Number of pages to show all products

  const arrayToItemsPerPage = Array.from(
    { length: totalPagesNumber },
    (_, index) => {
      const startPaginateNumber = index * totalPagesNumber;
      return dataShow?.slice(
        startPaginateNumber,
        startPaginateNumber + itemPerPage
      );
    }
  );
  return arrayToItemsPerPage;
}

export default paginate;
