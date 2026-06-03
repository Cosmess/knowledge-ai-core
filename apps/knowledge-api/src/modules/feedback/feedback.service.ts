import { Injectable } from "@nestjs/common";
import { FeedbackRequestDto, FeedbackResponse } from "@knowledge-ai/shared-types";
import { DatabaseService } from "../database/database.service.js";

@Injectable()
export class FeedbackService {
  constructor(private readonly database: DatabaseService) {}

  async create(request: FeedbackRequestDto, userId?: string): Promise<FeedbackResponse> {
    const result = await this.database.query<{ id: string; created_at: Date }>(
      `
        insert into feedbacks (user_id, question, answer, useful, comment)
        values ($1, $2, $3, $4, $5)
        returning id, created_at
      `,
      [userId, request.question, request.answer, request.useful, request.comment]
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error("Feedback insert did not return a row.");
    }

    return {
      id: row.id,
      createdAt: row.created_at.toISOString()
    };
  }
}
