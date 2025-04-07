"use client"

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Recycle, CheckCircle, Award, Home, Info, Leaf, PackagePlus, MapPin, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function RecyclePage({ auth, materials = [], success = false, ticket = null }) {
  const { url } = usePage();
  const { data, setData, post, processing, errors } = useForm({
    material_id: '',
    quantity: '',
    location: '',
    comments: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('recycling.store'));
  };

  // Si NO hay éxito, muestra el formulario (por defecto)
  if (!success) {
    return (
      <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrar Reciclaje</h2>}
      >
        <Head title="Registrar Reciclaje" />

        <div className="py-12 bg-gradient-to-b from-green-50 to-transparent">
          <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-200">
              {/* Cabecera con gradiente */}
              <div className="bg-gradient-to-r from-green-600 to-teal-500 py-4 px-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Recycle className="mr-2 h-6 w-6" />
                  Registrar Reciclaje
                </h2>
              </div>
              
              <div className="p-6 bg-gradient-to-b from-green-50 to-white">
                <p className="text-gray-600 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                  <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Registra los materiales que has reciclado para obtener puntos. Un encargado validará tu registro.</span>
                </p>
                
                {/* Formulario con useForm */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Material Reciclado */}
                  <div>
                    <label htmlFor="material_id" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <PackagePlus className="h-4 w-4 text-green-600 mr-1" />
                      Material Reciclado
                    </label>
                    <select
                      id="material_id"
                      value={data.material_id}
                      onChange={e => setData('material_id', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      required
                    >
                      <option value="">Selecciona un material</option>
                      {materials.map(material => (
                        <option key={material.id} value={material.id}>
                          {material.name} - {material.points_per_unit} pts/unidad
                        </option>
                      ))}
                    </select>
                    {errors.material_id && <div className="text-red-500 text-sm mt-1">{errors.material_id}</div>}
                  </div>
                  
                  {/* Cantidad */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <span className="inline-flex justify-center items-center w-4 h-4 text-green-600 mr-1">#</span>
                      Cantidad
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="Cantidad (máximo 50 por registro)"
                      value={data.quantity}
                      onChange={e => setData('quantity', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      required
                    />
                    {errors.quantity && <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>}
                  </div>
                  
                  {/* Ubicación */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <MapPin className="h-4 w-4 text-green-600 mr-1" />
                      Ubicación
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="Ej: Módulo A, Contenedor Principal"
                      value={data.location}
                      onChange={e => setData('location', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      required
                    />
                    {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
                  </div>
                  
                  {/* Comentarios */}
                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <MessageSquare className="h-4 w-4 text-green-600 mr-1" />
                      Comentarios (Opcional)
                    </label>
                    <textarea
                      id="comments"
                      placeholder="Comentarios adicionales"
                      value={data.comments}
                      onChange={e => setData('comments', e.target.value)}
                      rows="3"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    ></textarea>
                    {errors.comments && <div className="text-red-500 text-sm mt-1">{errors.comments}</div>}
                  </div>
                  
                  {/* Botón de envío */}
                  <div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 px-4 rounded-md hover:from-green-700 hover:to-green-600 transition-all shadow-md flex items-center justify-center"
                    >
                      {processing ? (
                        <>
                          <span className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white"></span>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Recycle className="mr-2 h-5 w-5" />
                          Registrar Reciclaje
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Nota informativa */}
                  <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p>
                      <strong>Nota:</strong> El registro será validado por un encargado. Una vez aprobado, 
                      los puntos correspondientes serán añadidos a tu cuenta.
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Etiqueta al estilo eco-friendly */}
            <div className="mt-4 flex justify-center">
              <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <Leaf className="h-3 w-3 mr-1" />
                Gracias por contribuir con el medio ambiente
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }
  
  // Si hay éxito, muestra la pantalla de confirmación
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrar Reciclaje</h2>}
    >
      <Head title="Registro Exitoso" />

      {/* Contenedor principal con fondo sutil */}
      <div className="py-12 bg-gradient-to-b from-green-50 to-transparent">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          {/* Tarjeta principal con mejor diseño y sombra */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-200 transform transition-all">
            {/* Cabecera con gradiente */}
            <div className="bg-gradient-to-r from-green-600 to-teal-500 py-4 px-6 text-center">
              <h2 className="text-xl font-bold text-white flex items-center justify-center">
                <Recycle className="h-6 w-6 mr-2" />
                Registro de Reciclaje
              </h2>
            </div>
            
            <div className="p-8">
              {/* Icono de éxito con animación y efectos */}
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-6 inline-flex shadow-inner border border-green-200">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
              </div>

              {/* Mensaje de éxito principal */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-green-600 mb-2">¡Registro Exitoso!</h2>
                <p className="text-gray-600">
                  Tu contribución al reciclaje ha sido registrada correctamente
                </p>
              </div>
              
              {/* Tarjeta de información del ticket */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 mb-6">
                <div className="flex flex-col space-y-4">
                  {/* Número de ticket */}
                  <div className="text-center">
                    <span className="block text-sm text-gray-500 mb-1">NÚMERO DE TICKET</span>
                    <span className="text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg border border-gray-200 inline-block shadow-sm">
                      {ticket.ticket_number}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Guarda este número para futuras referencias</p>
                  </div>
                  
                  {/* Línea divisoria estilizada */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-gray-50 px-2 text-sm text-gray-500">Detalles</span>
                    </div>
                  </div>
                  
                  {/* Puntos estimados en formato destacado */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-yellow-500 mr-3" />
                      <div>
                        <span className="block text-sm text-yellow-700">Puntos Estimados</span>
                        <span className="text-xl font-bold text-yellow-800">{ticket.points_earned} puntos</span>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Pendiente de validación
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Nota informativa mejorada */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-sm text-blue-700">
                <p className="flex items-start">
                  <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Nota:</strong> El registro será validado por un encargado. Una vez aprobado, 
                    los puntos correspondientes serán añadidos a tu cuenta.
                  </span>
                </p>
              </div>

              {/* Botones con mejor diseño */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                <a 
                  href={route('recycling.index') + '?new=true'} 
                  className="flex-1 py-3 px-4 bg-white border border-green-300 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-all flex items-center justify-center shadow-sm"
                >
                  <Recycle className="h-5 w-5 mr-2" />
                  Nuevo Registro
                </a>
                
                <a 
                  href={route('dashboard')} 
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all flex items-center justify-center shadow-md"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Volver al Dashboard
                </a>
              </div>
            </div>
          </div>
          
          {/* Etiqueta al estilo eco-friendly */}
          <div className="mt-4 flex justify-center">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <Leaf className="h-3 w-3 mr-1" />
              Gracias por contribuir con el medio ambiente
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}




