import React from "react";

export default function Modal({ title, open, onClose, className, children }: { title?: string, open: boolean, onClose: () => void, className: string, children: React.ReactNode }) {
    return (
        open ? <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center`}>
            <div className={`bg-white p-8 rounded-lg ${className}`}>
                <div className="flex bg-white rounded-md text-gray-400 mb-2 focus:outline-none focus:ring-2 focus:ring-offset-2 justify-between items-end">
                    <div>
                        {title && <h1 className="text-xl text-black font-bold">{title}</h1>}
                    </div>
                    <div>
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6 hover:cursor-pointer hover:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" onClick={onClose}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                {children}
            </div>
        </div> : <div></div>
    );
}