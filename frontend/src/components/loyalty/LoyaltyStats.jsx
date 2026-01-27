import PropTypes from 'prop-types';
import { Card } from '../ui';

const LoyaltyStats = ({ points, visits, vouchers, tier }) => {
    const nextTierPoints = 3000;
    const progress = Math.min((points / nextTierPoints) * 100, 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Loyalty Points */}
            <Card variant="elevated" className="p-6">
                <p className="text-sm text-accent-bronze uppercase tracking-wider mb-1 font-bold">Loyalty Points</p>
                <p className="text-3xl font-display font-bold text-primary">{points.toLocaleString()}</p>
                <div className="w-full bg-accent-cream dark:bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-[11px] text-accent-bronze mt-2 font-medium">
                    {points >= nextTierPoints
                        ? 'You are a Platinum member!'
                        : `${(nextTierPoints - points).toLocaleString()} points until Platinum status`}
                </p>
            </Card>

            {/* Total Visits */}
            <Card variant="elevated" className="p-6">
                <p className="text-sm text-accent-bronze uppercase tracking-wider mb-1 font-bold">Total Visits</p>
                <p className="text-3xl font-display font-bold text-maroon-dark dark:text-white">{visits}</p>
                <p className="text-[11px] text-accent-bronze mt-2 font-medium">Lifetime visits at Elsa Coiffure</p>
            </Card>

            {/* Reward Vouchers */}
            <Card variant="elevated" className="p-6">
                <p className="text-sm text-accent-bronze uppercase tracking-wider mb-1 font-bold">Reward Vouchers</p>
                <p className="text-3xl font-display font-bold text-maroon-dark dark:text-white">{vouchers}</p>
                <p className="text-[11px] text-primary font-bold mt-2 cursor-pointer hover:underline">View rewards</p>
            </Card>
        </div>
    );
};

LoyaltyStats.propTypes = {
    points: PropTypes.number.isRequired,
    visits: PropTypes.number.isRequired,
    vouchers: PropTypes.number.isRequired,
    tier: PropTypes.string.isRequired,
};

export default LoyaltyStats;
