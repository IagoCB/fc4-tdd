import { FullRefund } from './full_refund';
import { NoRefund } from './no_refund';
import { PartialRefund } from './partial_refund';
import { RefundRuleFactory } from './refund_rule_factory';

describe('RefundRuleFactory', () => {
    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
        const daysUntilCheckIn = 8;
        const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

        expect(refundRule).toBeInstanceOf(FullRefund);
    });

    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
        const daysUntilCheckIn1 = 1;
        const refundRule1 = RefundRuleFactory.getRefundRule(daysUntilCheckIn1);

        expect(refundRule1).toBeInstanceOf(PartialRefund);

        const daysUntilCheckIn2 = 7;
        const refundRule2 = RefundRuleFactory.getRefundRule(daysUntilCheckIn2);

        expect(refundRule2).toBeInstanceOf(PartialRefund);

        const daysUntilCheckIn3 = 3;
        const refundRule3 = RefundRuleFactory.getRefundRule(daysUntilCheckIn3);

        expect(refundRule3).toBeInstanceOf(PartialRefund);
    });

    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
        const daysUntilCheckIn = 0;
        const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

        expect(refundRule).toBeInstanceOf(NoRefund);

        const daysUntilCheckInNegative = -1;
        const refundRuleNegative = RefundRuleFactory.getRefundRule(daysUntilCheckInNegative);

        expect(refundRuleNegative).toBeInstanceOf(NoRefund);
    });
});