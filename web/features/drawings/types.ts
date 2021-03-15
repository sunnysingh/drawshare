export type Step = {
  strokeWidth: number;
  color: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export type Drawing = {
  username: string;
  steps: Step[];
  isPublic: boolean;
  drawTime: number;
  createdAt: number;
  _id: string;
};
