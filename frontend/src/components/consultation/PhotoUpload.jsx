import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../ui';

const PhotoUpload = ({ photo, onUpload }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // In a real app, you'd upload to a server/Cloudinary here
        // For now, we'll use a local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpload(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-center md:text-left">
                    <h4 className="text-xl font-display font-bold text-maroon-dark dark:text-text-light">
                        Upload a Clear Photo of Your Hair
                    </h4>
                    <p className="text-accent-bronze font-medium leading-relaxed">
                        For the most accurate analysis, please provide a clear, well-lit photo of your natural hair without any styling products.
                    </p>
                    <ul className="space-y-2 text-sm text-accent-bronze font-bold">
                        <li className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Natural lighting is best
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Focus on the mid-section and ends
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Ensure the image is sharp and clear
                        </li>
                    </ul>
                </div>

                <div
                    className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-300 min-h-[300px] ${dragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-accent-cream dark:border-maroon-light bg-white/40 dark:bg-maroon-dark/40'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {photo ? (
                        <div className="relative size-full animate-fade-in">
                            <img src={photo} alt="Preview" className="max-h-[250px] mx-auto rounded-xl shadow-lg border-4 border-white" />
                            <button
                                onClick={() => onUpload(null)}
                                className="absolute -top-4 -right-4 bg-accent-rose text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                            >
                                <span className="material-symbols-outlined block">close</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
                            </div>
                            <p className="text-maroon-dark dark:text-text-light font-bold mb-2">Drag and drop your photo</p>
                            <p className="text-sm text-accent-bronze font-medium mb-6 text-center">or click to browse your files</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md">
                                Choose Photo
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <Card variant="light" className="p-4 flex flex-col items-center text-center">
                    <div className="size-10 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined">light_mode</span>
                    </div>
                    <p className="text-xs font-bold text-maroon-dark dark:text-text-light">Good Lighting</p>
                </Card>
                <Card variant="light" className="p-4 flex flex-col items-center text-center">
                    <div className="size-10 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined">center_focus_strong</span>
                    </div>
                    <p className="text-xs font-bold text-maroon-dark dark:text-text-light">Focused Shot</p>
                </Card>
                <Card variant="light" className="p-4 flex flex-col items-center text-center">
                    <div className="size-10 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined">refresh</span>
                    </div>
                    <p className="text-xs font-bold text-maroon-dark dark:text-text-light">Natural State</p>
                </Card>
            </div>
        </div>
    );
};

PhotoUpload.propTypes = {
    photo: PropTypes.string,
    onUpload: PropTypes.func.isRequired,
};

export default PhotoUpload;
