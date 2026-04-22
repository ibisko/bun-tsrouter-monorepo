import z from 'zod';

export namespace Gemini {
  // export type Role = 'user' | 'model';
  export type Content = z.output<typeof geminiRequestSchema>['contents'][number];
  export type Role = Content['role'];
  /**
   * https://ai.google.dev/gemini-api/docs/gemini-3?hl=zh-cn#meet_the_gemini_3_series
   */
  export enum Model {
    /**
     * - 上下文窗口 输入100w, 输出6.4w
     * - $0.25（文本、图片、视频），$0.50（音频）/ $1.50
     */
    FlashLitePreview = 'gemini-3.1-flash-lite-preview',
    /**
     * - 上下文窗口 输入12.8w, 输出3.2w
     * - $0.25（文本输入）/ $0.067（图片输出）
     */
    FlashImagePreview = 'gemini-3.1-flash-image-preview',
    /**
     * - 上下文窗口 输入100w, 输出6.4w
     * - $2 / $12（<20 万个 token）
     * - $4 / $18（>20 万个 token）
     */
    ProPreview = 'gemini-3.1-pro-preview',
    /**
     * - 上下文窗口 输入100w, 输出6.4w
     * - $0.50 / $3
     */
    FLashPreview = 'gemini-3-flash-preview',
    /**
     * - 上下文窗口 输入6.5w, 输出3.2w
     * - $2（文本输入）/ $0.134（图片输出）
     */
    ProImagePreview = 'gemini-3-pro-image-preview',
  }

  /**
   * https://ai.google.dev/gemini-api/docs/gemini-3?hl=zh-cn#thinking_level
   */
  export enum ThinkingLevel {
    /**
     * - 与大多数查询的“无思考”设置相匹配。对于复杂的编码任务，模型可能会进行非常少的思考。最大限度地缩短聊天或高吞吐量应用的延迟时间。请注意，minimal 并不能保证思考功能处于关闭状态。
     * - Gemini 3.1 Pro 不支持
     */
    Minimal = 'minimal',
    /** 最大限度地缩短延迟时间和降低费用。最适合简单的指令遵循、聊天或高吞吐量应用。 */
    Low = 'low',
    /** 针对大多数任务进行平衡思考。 */
    Medium = 'medium',
    /** 最大限度地提高推理深度。模型可能需要更长的时间才能 生成第一个（无思考）输出 token，但输出将经过更仔细的推理。 */
    High = 'high',
  }

  /**
   * https://ai.google.dev/gemini-api/docs/gemini-3?hl=zh-cn#media_resolution
   */
  export enum MediaResolutionLevel {
    /**
     * - Google 图片
     * - max token: 1120
     * - 建议用于大多数图片分析任务，以确保获得最高质量。
     */
    MediaResolutionHigh = 'media_resolution_high',
    /**
     * - PDF, 视频(同 media_resolution_low)
     * - max token: 560
     * - 最适合文档理解；质量通常在 medium 时达到饱和。对于标准文档，将分辨率提高到 high 很少能改善 OCR 结果。
     */
    MediaResolutionMedium = 'media_resolution_medium',
    /**
     * - 视频（常规）
     * - max token: 70（每帧）
     * - 注意： 对于视频，low 和 medium 设置的处理方式相同（70 个 token），以优化上下文使用。这对于大多数动作识别和描述任务来说已经足够。
     */
    MediaResolutionLow = 'media_resolution_low',
    /**
     * - 视频（文本密集型）
     * - max token: 280（每帧）
     * - 仅当应用场景涉及读取密集文本 (OCR) 或视频帧中的小细节时才需要。
     */
    media_resolution_high = 'media_resolution_high',
  }

  type Part = {
    text: string;
    inline_data?: {
      mime_type: 'image/jpeg';
      data: string;
    };
    mediaResolution?: {
      level: 'media_resolution_high' | 'media_resolution_medium' | 'media_resolution_low';
    };
  };

  export type Contents = {
    role: Role;
    parts: Part[];
  };

  export type GenerationConfig = {
    thinkingConfig?: {
      thinkingLevel: 'low' | 'minimal' | 'medium' | 'high';
    };

    // tools
    responseMimeType?: 'application/json';
    responseJsonSchema?: {
      type: 'object';
      properties: {
        winner: { type: 'string'; description: 'The name of the winner.' };
        final_match_score: { type: 'string'; description: 'The final score.' };
        scorers: {
          type: 'array';
          items: { type: 'string' };
          description: 'The name of the scorer.';
        };
      };
      required: ['winner', 'final_match_score', 'scorers'];
    };

    imageConfig: {
      aspectRatio: '16:9';
      imageSize: '4K';
    };
  };

  type Tool = { googleSearch: {} } | { urlContext: {} };

  export type UsageMetadata = {
    promptTokenCount: number;
    totalTokenCount: number;
    promptTokensDetails: { modality: 'TEXT'; tokenCount: number }[];
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
  };

  export type Candidate = {
    content: {
      role: 'model';
      parts: { text: string; thought?: boolean; thoughtSignature?: string }[];
    };
    index: number;
    finishReason?: 'STOP';
  };

  export type StreamResponse = {
    candidates: Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion: Model;
    responseId: string;
  };
}

export const geminiRequestSchema = z.object({
  systemInstruction: z
    .object({
      parts: z.array(
        z.object({
          text: z.string(),
        }),
      ),
    })
    .optional(),
  contents: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      parts: z.array(
        z.object({
          type: z.enum(['text']).optional(),
          text: z.string(),
        }),
      ),
    }),
  ),
  generationConfig: z.object({}),
});
