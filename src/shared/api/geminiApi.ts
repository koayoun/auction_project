import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AuctionItem } from '../../entities/auction';

export class GeminiService {
  // 환경 변수에서 API 키 가져오기 (Vite는 VITE_ 접두사 필요)
  static API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  static MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
  static genAI: GoogleGenerativeAI | null = null;

  static getClient(): GoogleGenerativeAI {
    if (!GeminiService.API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }

    if (!GeminiService.genAI) {
      GeminiService.genAI = new GoogleGenerativeAI(GeminiService.API_KEY);
    }
    return GeminiService.genAI;
  }

  /**
   * 경매 물건 분석 데이터를 Gemini API에 전달하여 종합 분석을 받아옵니다.
   */
  static async analyzeAuctionItem(
    item: AuctionItem,
    analysisData: {
      priceScore: number;
      riskScore: number;
      totalScore: number;
      appraisalPrice: number;
      minSalePrice: number;
      estimatedMarketPrice?: number;
      appraisalRatio: number;
      priceDifference?: number;
      locationImportance: '높음' | '보통' | '낮음';
      propertyStatus: string;
      rightAnalysisResult: string;
      dividendDeadline?: string;
    }
  ): Promise<{
    investmentValue: string;
    riskAnalysis: string;
    locationAnalysis: string;
    overallOpinion: string;
    investmentRating: string;
  }> {
    const genAI = GeminiService.getClient();
    const model = genAI.getGenerativeModel({ 
      model: GeminiService.MODEL,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    // 프롬프트 구성
    const prompt = `다음 경매 물건 정보를 바탕으로 투자 분석을 작성해주세요. 당신은 경매 전문가이므로 최대한 정확하고 자세하게 분석해주세요.

## 경매 물건 정보
- 사건번호: ${item.caseNumber}
- 법원: ${item.court}
- 소재지: ${item.address}
${item.detailedAddress ? `- 상세 주소: ${item.detailedAddress}` : ''}
- 감정평가액: ${analysisData.appraisalPrice.toLocaleString()}원
- 최저매각가격: ${analysisData.minSalePrice.toLocaleString()}원
${analysisData.estimatedMarketPrice ? `- 추정 시세: ${analysisData.estimatedMarketPrice.toLocaleString()}원` : ''}
- 감정가 대비 할인율: ${analysisData.appraisalRatio}%
${analysisData.priceDifference ? `- 시세차익(예상): ${analysisData.priceDifference.toLocaleString()}원` : ''}
- 소재지 중요도: ${analysisData.locationImportance}
${item.dividendDeadline ? `- 배당요구종기: ${item.dividendDeadline}` : ''}
${item.note ? `- 비고: ${item.note}` : ''}
${item.area ? `- 면적: ${item.area}m²` : ''}

## 분석 점수
- 가격 매력도: ${analysisData.priceScore}점
- 권리 위험도: ${analysisData.riskScore}점
- 종합 투자 점수: ${analysisData.totalScore}점
- 물건 상태: ${analysisData.propertyStatus}
- 권리 분석 결과: ${analysisData.rightAnalysisResult}

다음 4개 섹션으로 나누어 분석을 작성해주세요. 각 섹션은 2-3문장으로 간결하게 작성하고, 중요한 숫자나 정보는 강조해주세요.

1. **투자 가치 평가**: 감정가 대비 할인율, 시세차익, 잠재 수익률 등을 분석
2. **리스크 분석**: 물건 상태, 권리 관계, 배당요구종기 등을 분석
3. **입지 분석**: 소재지의 교통 접근성, 주변 환경, 실거주/임대 수요 등을 분석
4. **종합 의견**: 투자 매력도를 별점(1-5개)으로 평가하고, 최종 추천 의견을 작성

응답은 다음 JSON 형식으로 작성해주세요:
{
  "investmentValue": "투자 가치 평가 내용",
  "riskAnalysis": "리스크 분석 내용",
  "locationAnalysis": "입지 분석 내용",
  "overallOpinion": "종합 의견 내용",
  "investmentRating": "★★★★★ (5/5)"
}`;

    try {
      const result = await model.generateContent(prompt);

      const response = result.response;
      const text = response.text();

      // JSON 추출 시도
      try {
        // JSON 블록 찾기
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            investmentValue: parsed.investmentValue || text,
            riskAnalysis: parsed.riskAnalysis || text,
            locationAnalysis: parsed.locationAnalysis || text,
            overallOpinion: parsed.overallOpinion || text,
            investmentRating: parsed.investmentRating || '★★★★★ (5/5)',
          };
        }
      } catch (e) {
        // JSON 파싱 실패 시 전체 텍스트를 종합 의견으로 사용
        console.warn('JSON 파싱 실패, 전체 텍스트 사용:', e);
      }

      // JSON이 없으면 전체 텍스트를 종합 의견으로 사용
      return {
        investmentValue: text,
        riskAnalysis: text,
        locationAnalysis: text,
        overallOpinion: text,
        investmentRating: '★★★★★ (5/5)',
      };
    } catch (error) {
      console.error('Gemini API 호출 실패:', error);
      throw new Error(
        `AI 분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }
}

