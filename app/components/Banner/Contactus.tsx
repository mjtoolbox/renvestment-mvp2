"use client"
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../Toast/ToastProvider';

interface ContactProps {
    label?: string;
    buttonClass?: string;
}

const Contactusform = ({ label = 'Contact Us', buttonClass = '' }: ContactProps) => {
    let [isOpen, setIsOpen] = useState(false)

    const [inputValues, setInputValues] = useState({
        input1: '',
        input2: '',
        // input3 was message; replace with role (tenant|landlord|property management)
        role: ''
    });

    const { addToast } = useToast();
    const [emailError, setEmailError] = useState('');

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        // clear inline email error when user edits the email field
        if (name === 'input2') setEmailError('');
        setInputValues(prevState => ({ ...prevState, [name]: value }));
    }

    // FORM SUBMIT
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const normalizedEmail = String(inputValues.input2).trim().toLowerCase();
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: inputValues.input1, email: normalizedEmail, role: inputValues.role })
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                const msg = json?.error || 'Failed to submit';
                // If the server indicates the email already exists, show inline error
                if (res.status === 409 || /email already exists/i.test(String(msg))) {
                    setEmailError(msg);
                } else {
                    addToast(msg, 'error', 3000);
                }
                return;
            }
            // success
            const data = await res.json();
            setIsOpen(false);
            // reset form and clear inline error
            setInputValues({ input1: '', input2: '', role: '' });
            setEmailError('');
            addToast('Thanks! We received your submission.', 'success', 3000);
        } catch (err) {
            // show friendly error to user
            addToast('Submission failed. Please try again later.', 'error', 3000);
        }
    };

    const isDisabled = Object.values(inputValues).some((value) => value === '');


    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    return (
        <>
            <div className=" inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto md:ml-6 sm:pr-0">
                <div className='hidden lg:block'>
                    <button type="button" className={buttonClass || 'justify-end text-xl font-semibold bg-transparent py-4 px-6 lg:px-12 navbutton rounded-full hover:bg-navyblue hover:text-white'} onClick={openModal}>
                        {label}
                    </button>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                    <div className="py-8 lg:py-8 px-4 mx-auto max-w-screen-md">
                                        <div className="flex flex-shrink-0 items-center justify-center">
                                            <Link href="/" className='text-2xl sm:text-4xl font-semibold text-black'>
                                                Renvestment
                                            </Link>
                                        </div>
                                        <p className="mb-8 lg:mb-8 mt-8 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">We will send you product launch updates.</p>
                                        <form action="#" className="space-y-8" onSubmit={handleSubmit}>
                                            <div>
                                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your Name <span className="text-red-600" aria-hidden> *</span></label>
                                                <input
                                                    id="text"

                                                    name="input1"
                                                    value={inputValues.input1}
                                                    onChange={handleChange}

                                                    type="text"
                                                    autoComplete="current-password"
                                                    required
                                                    className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="Name..."
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email <span className="text-red-600" aria-hidden> *</span></label>
                                                <input
                                                    id="email"
                                                    name="input2"
                                                    value={inputValues.input2}
                                                    onChange={handleChange}

                                                    type="email"
                                                    autoComplete="current-password"
                                                    required
                                                    aria-describedby={emailError ? 'email-error' : undefined}
                                                    aria-invalid={Boolean(emailError)}
                                                    className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="xyz@email.com"
                                                />
                                                {emailError && (
                                                    <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{emailError}</p>
                                                )}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">I am a <span className="text-red-600" aria-hidden> *</span></label>
                                                <select
                                                    id="role"
                                                    name="role"
                                                    value={inputValues.role}
                                                    onChange={handleChange}
                                                    required
                                                    aria-required="true"
                                                    className="relative block w-full appearance-none rounded-md border border-linegrey px-3 py-2 text-gray-900 bg-white sm:text-sm"
                                                >
                                                    <option value="">Select one...</option>
                                                    <option value="tenant">Tenant</option>
                                                    <option value="landlord">Landlord</option>
                                                    <option value="property_management">Property Management</option>
                                                </select>
                                            </div>
                                            {/* Show submit button always. Add top margin equal to button height for spacing. */}
                                            <div className="mt-12">
                                                <button type="submit"
                                                    disabled={isDisabled}
                                                    className="h-12 flex items-center justify-center py-0 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-blue focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                                            </div>

                                        </form>

                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Toasts are handled by the global ToastProvider */}
        </>
    )
}

export default Contactusform;
