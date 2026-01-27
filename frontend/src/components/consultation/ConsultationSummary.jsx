import PropTypes from 'prop-types';
import { Card, Button } from '../ui';

const ConsultationSummary = ({ steps, currentStep, onStepClick }) => {
    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    return (
        <Card variant="elevated" className="sticky top-24 p-8 flex flex-col gap-8 h-fit border-l-4 border-l-primary">
            <div>
                <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Progress</p>
                    <p className="text-sm font-bold text-maroon-dark dark:text-text-light">
                        Step {currentStep}: {steps[currentStep - 1].title}
                    </p>
                </div>
                <div className="w-full bg-accent-cream dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-right text-[10px] text-accent-bronze mt-1 font-bold">
                    {Math.round(progress)}% Complete
                </p>
            </div>

            <div className="space-y-6">
                <h4 className="text-lg font-display font-bold text-maroon-dark dark:text-text-light border-b border-accent-cream/50 dark:border-maroon-light/30 pb-2">
                    Consultation Summary
                </h4>

                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const stepNum = index + 1;
                        const isCompleted = currentStep > stepNum;
                        const isCurrent = currentStep === stepNum;

                        return (
                            <div
                                key={step.id}
                                className={`flex items-start gap-3 transition-opacity ${!isCompleted && !isCurrent ? 'opacity-40' : 'opacity-100'}`}
                            >
                                <div className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${isCompleted
                                        ? 'bg-accent-emerald text-white'
                                        : isCurrent
                                            ? 'bg-primary text-white scale-110 shadow-md'
                                            : 'bg-accent-cream dark:bg-white/10 text-accent-bronze'
                                    }`}>
                                    {isCompleted ? (
                                        <span className="material-symbols-outlined text-[14px]">check</span>
                                    ) : (
                                        stepNum
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${isCurrent ? 'text-primary' : 'text-maroon-dark dark:text-text-light'}`}>
                                        {step.title}
                                    </p>
                                    {step.value && (
                                        <p className="text-xs text-accent-bronze mt-0.5 font-medium animate-fade-in">
                                            {step.value}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Card variant="light" className="p-4 bg-primary/5 border-primary/10">
                <div className="flex gap-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-[11px] text-accent-bronze font-medium leading-relaxed">
                        Data from this consultation helps us curate products exactly for your hair porosity and texture.
                    </p>
                </div>
            </Card>

            <div className="pt-4 mt-auto">
                <p className="text-[10px] text-accent-bronze font-bold text-center italic">
                    All data is stored securely in your hair profile.
                </p>
            </div>
        </Card>
    );
};

ConsultationSummary.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        value: PropTypes.string,
    })).isRequired,
    currentStep: PropTypes.number.isRequired,
    onStepClick: PropTypes.func,
};

export default ConsultationSummary;
