export interface  SystemHealth{

  status: string;
    components: {
      db: {
        status: string,
        details: {
          database: string,
          validationQuery: number
        }
      },
      diskSpace: {
        status: string,
        details: {
          total: number,
          free: number | string,
          threshold: number
        }
      }
    };

}

