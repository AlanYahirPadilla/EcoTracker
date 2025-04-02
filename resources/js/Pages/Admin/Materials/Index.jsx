"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { Recycle, Search, Plus, Edit, Trash, Weight, Tag } from "lucide-react"
import axios from "axios"

export default function MaterialsIndex({ auth }) {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    points_per_unit: "",
    weight_per_unit: "",
    is_active: true,
  })

  useEffect(() => {
    // Datos de ejemplo para mostrar cuando la API falla
    const exampleMaterials = [
      {
        id: 1,
        name: "Papel",
        description: "Papel de oficina, periódicos, revistas",
        points_per_unit: 2,
        weight_per_unit: 0.1,
        is_active: true,
        recycling_count: 120,
      },
      {
        id: 2,
        name: "Plástico PET",
        description: "Botellas de plástico transparente",
        points_per_unit: 3,
        weight_per_unit: 0.05,
        is_active: true,
        recycling_count: 85,
      },
      {
        id: 3,
        name: "Aluminio",
        description: "Latas de aluminio",
        points_per_unit: 5,
        weight_per_unit: 0.02,
        is_active: true,
        recycling_count: 65,
      },
      {
        id: 4,
        name: "Vidrio",
        description: "Botellas y frascos de vidrio",
        points_per_unit: 4,
        weight_per_unit: 0.3,
        is_active: true,
        recycling_count: 40,
      },
      {
        id: 5,
        name: "Cartón",
        description: "Cajas y empaques de cartón",
        points_per_unit: 2,
        weight_per_unit: 0.15,
        is_active: true,
        recycling_count: 95,
      },
    ]

    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/materials")
        if (response.data && Array.isArray(response.data)) {
          // Asegurarse de que cada material tenga los campos necesarios
          setMaterials(
            response.data.map((material) => ({
              ...material,
              recycling_count: material.recycling_count || 0,
              weight_per_unit: material.weight_per_unit || 0.1,
              is_active: material.is_active !== undefined ? material.is_active : true,
            })),
          )
          setError(null)
        } else {
          throw new Error("Formato de respuesta inválido")
        }
      } catch (err) {
        console.error("Error al cargar materiales:", err)
        setError("No se pudieron cargar los materiales. Usando datos de ejemplo.")
        setMaterials(exampleMaterials)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  // Filtrar materiales según el término de búsqueda
  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenModal = (material = null) => {
    if (material) {
      setEditingMaterial(material)
      setFormData({
        name: material.name,
        description: material.description,
        points_per_unit: material.points_per_unit,
        weight_per_unit: material.weight_per_unit,
        is_active: material.is_active,
      })
    } else {
      setEditingMaterial(null)
      setFormData({
        name: "",
        description: "",
        points_per_unit: "",
        weight_per_unit: "",
        is_active: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingMaterial(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Datos del formulario:", formData)
    handleCloseModal()
  }

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Materiales</h2>}
    >
      <Head title="Gestión de Materiales" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Recycle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-medium">Materiales Reciclables</h3>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Material</span>
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md mb-6">{error}</div>}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Cargando materiales...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="text-center py-8">
                <Recycle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron materiales</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Material
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Puntos por Unidad
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Peso por Unidad (kg)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reciclajes
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{material.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm text-gray-900">{material.points_per_unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Weight className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm text-gray-900">{material.weight_per_unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              material.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {material.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {material.recycling_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModal(material)}
                              className="p-1 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200"
                              title="Editar"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                              title="Eliminar"
                              disabled={material.recycling_count > 0}
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear/editar material */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">{editingMaterial ? "Editar Material" : "Nuevo Material"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="points_per_unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Puntos por Unidad
                  </label>
                  <input
                    type="number"
                    id="points_per_unit"
                    name="points_per_unit"
                    value={formData.points_per_unit}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="weight_per_unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Peso por Unidad (kg)
                  </label>
                  <input
                    type="number"
                    id="weight_per_unit"
                    name="weight_per_unit"
                    value={formData.weight_per_unit}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Activo
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  {editingMaterial ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}


