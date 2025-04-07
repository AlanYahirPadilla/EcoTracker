// En resources/js/Pages/RecyclingManager/History.jsx
import React, { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, History, Copy, X, Download, FileText, Table } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function HistoryPage({ auth, completedRedemptions }) {
    const [selectedRedemption, setSelectedRedemption] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportMenuRef = useRef(null);
    const totalPoints = completedRedemptions.reduce((sum, redemption) => sum + redemption.points, 0);

    const openDetails = (redemption) => {
        setSelectedRedemption(redemption);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const copyToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                    fallbackCopyToClipboard(text);
                });
        } else {
            fallbackCopyToClipboard(text);
        }
    };

    const fallbackCopyToClipboard = (text) => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error en el método alternativo de copia: ', err);
            alert('No se pudo copiar. Por favor, copia manualmente: ' + text);
        }
    };

    const toggleExportMenu = () => {
        setShowExportMenu(!showExportMenu);
    };

    const exportToPDF = () => {
        window.location.href = '/recycling-manager/export-history?format=pdf';
        setShowExportMenu(false);
    };

    const exportToExcel = () => {
        window.location.href = '/recycling-manager/export-history?format=excel';
        setShowExportMenu(false);
    };

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [exportMenuRef]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historial de Canjes</h2>}
        >
            <Head title="Historial de Canjes" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href="/recycling-manager/dashboard"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Volver al panel de canjes
                        </Link>
                        
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={toggleExportMenu}
                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-800 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </button>
                            
                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={exportToPDF}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FileText className="h-4 w-4 inline mr-2" />
                                            Exportar a PDF
                                        </button>
                                        <button
                                            onClick={exportToExcel}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Table className="h-4 w-4 inline mr-2" />
                                            Exportar a Excel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
                            <div className="uppercase text-xs text-gray-500 font-medium">Total de canjes</div>
                            <div className="text-2xl font-bold mt-1">{completedRedemptions.length}</div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
                            <div className="uppercase text-xs text-gray-500 font-medium">Total de puntos acumulados</div>
                            <div className="text-2xl font-bold text-green-600 mt-1">{totalPoints} pts</div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="bg-green-600 p-4 flex items-center">
                            <History className="h-5 w-5 text-white mr-2" />
                            <h2 className="text-lg font-semibold text-white">Historial Completo de Canjes</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recompensa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {completedRedemptions.map((redemption) => (
                                        <tr 
                                            key={redemption.id} 
                                            className="hover:bg-gray-50 cursor-pointer" 
                                            onClick={() => openDetails(redemption)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{redemption.completed_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{redemption.reward}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{redemption.user}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{redemption.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{redemption.points} pts</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && selectedRedemption && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
                        <button 
                            onClick={closeModal} 
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        
                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 rounded-full p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                </div>
                            </div>
                            
                            <h3 className="text-center text-xl font-medium text-gray-900 mb-1">Detalle del Ticket</h3>
                            <p className="text-center text-gray-500 text-sm mb-6">Información completa del canje</p>
                            
                            <div className="bg-gray-50 p-4 rounded-md mb-4">
                                <p className="text-sm text-gray-500 mb-1">Número de ticket:</p>
                                <div className="flex items-center">
                                    <p className="font-medium text-center flex-1">{selectedRedemption.code}</p>
                                    <button 
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(selectedRedemption.code);
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Estado</p>
                                    <p className="flex items-center text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Completado
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fecha de canje</p>
                                    <p className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {selectedRedemption.completed_at}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Recompensa</p>
                                    <p className="font-medium">{selectedRedemption.reward}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Usuario</p>
                                    <p>{selectedRedemption.user}</p>
                                </div>
                            </div>
                            
                            <div className="bg-purple-50 p-4 rounded-md">
                                <p className="text-sm text-purple-600 mb-1">Puntos obtenidos:</p>
                                <p className="text-2xl font-bold text-purple-700 text-center">{selectedRedemption.points}</p>
                            </div>
                            
                            <button 
                                onClick={closeModal}
                                className="mt-6 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {copied && (
                <div className="fixed top-24 left-0 right-0 flex justify-center z-50">
                    <div className="bg-green-500 text-white py-2 px-4 rounded shadow-lg">
                        ¡Código copiado!
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}