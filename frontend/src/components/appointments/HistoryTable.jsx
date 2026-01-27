import PropTypes from 'prop-types';
import { Button } from '../ui';

const HistoryTable = ({ services, onRebook }) => {
    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-accent-cream/20 dark:border-maroon-light/20">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-maroon-dark/5 dark:bg-white/5 text-accent-bronze text-xs uppercase tracking-widest">
                            <th className="px-8 py-5 font-bold">Service Details</th>
                            <th className="px-6 py-5 font-bold">Stylist</th>
                            <th className="px-6 py-5 font-bold">Date</th>
                            <th className="px-6 py-5 font-bold text-right">Price</th>
                            <th className="px-8 py-5 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-accent-cream/20 dark:divide-maroon-light/20">
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-accent-cream/10 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <p className="font-bold text-maroon-dark dark:text-text-light">{service.name}</p>
                                    {service.description && (
                                        <p className="text-sm text-accent-bronze font-medium">{service.description}</p>
                                    )}
                                </td>
                                <td className="px-6 py-6 text-text-dark dark:text-text-light font-medium">
                                    {service.stylist_name}
                                </td>
                                <td className="px-6 py-6 text-text-dark dark:text-text-light font-medium">
                                    {service.date}
                                </td>
                                <td className="px-6 py-6 text-right font-bold text-maroon-dark dark:text-text-light">
                                    {service.price}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onRebook?.(service)}
                                        className="py-2"
                                    >
                                        Rebook
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-8 py-4 bg-maroon-dark/5 dark:bg-white/5 flex justify-center">
                <button className="text-sm text-primary font-bold hover:underline transition-all">
                    View All History
                </button>
            </div>
        </div>
    );
};

HistoryTable.propTypes = {
    services: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        stylist_name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
    })).isRequired,
    onRebook: PropTypes.func,
};

export default HistoryTable;
