import PropTypes from 'prop-types';
import { Card, Button } from '../ui';

const AppointmentCard = ({ appointment, onReschedule, onCancel }) => {
    const {
        service_name,
        stylist_name,
        date,
        time,
        duration,
        image_url,
        days_away
    } = appointment;

    return (
        <Card variant="default" className="p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg transition-transform hover:scale-[1.005]">
            <div className="size-32 rounded-xl overflow-hidden flex-shrink-0 bg-accent-cream/20">
                <img
                    className="size-full object-cover"
                    src={image_url || 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=200'}
                    alt={service_name}
                />
            </div>

            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Next Visit</span>
                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                    <span className="text-xs text-accent-bronze font-medium">{days_away} days away</span>
                </div>

                <h4 className="text-2xl font-display font-bold text-maroon-dark dark:text-white">
                    {service_name}
                </h4>

                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-accent-bronze">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                        <span className="font-medium">{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                        <span className="font-medium">{time} ({duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">person_pin</span>
                        <span className="font-medium">Stylist: {stylist_name}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto min-w-[160px]">
                <Button variant="primary" onClick={() => onReschedule?.(appointment.id)}>
                    Reschedule
                </Button>
                <Button variant="secondary" onClick={() => onCancel?.(appointment.id)}>
                    Cancel
                </Button>
            </div>
        </Card>
    );
};

AppointmentCard.propTypes = {
    appointment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        service_name: PropTypes.string.isRequired,
        stylist_name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        image_url: PropTypes.string,
        days_away: PropTypes.number.isRequired,
    }).isRequired,
    onReschedule: PropTypes.func,
    onCancel: PropTypes.func,
};

export default AppointmentCard;
