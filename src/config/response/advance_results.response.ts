import { Response } from "express";

export interface ResultsResponse extends Response {
  advancedResults: any;
}
