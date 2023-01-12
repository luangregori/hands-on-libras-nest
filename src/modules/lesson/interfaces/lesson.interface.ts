import { ChallengeResult } from "../../../modules/challenge-result/schemas/challenge-result.schema"
import { Lesson } from "../schemas/lesson.schema"

export interface StartLessonResult {
  lessonInfo: Lesson
  userInfo: ChallengeResult
}
