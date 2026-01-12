export type WorkerRequest =
  | { type: "LOAD"; baseUrl: string }
  | {
      type: "CONVERT";
      file: File;
      settings: {
        start: number;
        end: number;
        fps: number;
      };
    };

export type WorkerResponse =
  | { type: "LOADED" }
  | { type: "PROGRESS"; progress: number }
  | { type: "DONE"; data: Blob }
  | { type: "ERROR"; message: string };
