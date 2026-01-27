import { useState } from 'react';
import PropTypes from 'prop-types';

const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border border-maroon-dark/20 dark:border-white/10 rounded-xl overflow-hidden bg-white/40 dark:bg-maroon-dark/40 backdrop-blur-sm transition-all duration-300">
            <button
                onClick={onClick}
                className="w-full flex cursor-pointer items-center justify-between p-5 text-left focus:outline-none"
            >
                <span className={`text-base font-bold transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-maroon-dark dark:text-text-light'}`}>
                    {title}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-accent-bronze'}`}>
                    expand_more
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-5 pb-5 text-sm leading-relaxed text-accent-bronze dark:text-text-light/70 font-medium">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

AccordionItem.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

Accordion.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.node.isRequired,
    })).isRequired,
};

export default Accordion;
