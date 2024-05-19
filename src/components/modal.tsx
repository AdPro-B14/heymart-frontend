import React from "react";

export default function Modal({ open, onClose, className, children }: { open: boolean, onClose: () => void, className: string, children: React.ReactNode }) {
    return (
        open ? <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center`}>
            <div className={`bg-white p-8 rounded-lg ${className}`}>
                <div className="flex bg-white rounded-md text-gray-400 hover:text-slate-500 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 justify-end items-end" onClick={onClose}>
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                {children}
            </div>
        </div> : <div></div>
    );
}