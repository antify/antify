export type Response = {
  default: {
    data: {
      id: string;
      name: string;
      url?: string;
    }[];
    pagination?: {
      page: number;
      itemsPerPage: number;
      count: number;
    };
  };
};
