import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmpresaNavbar from "@/components/layout/EmpresaNavbar";

const CARDS = [
	{
		key: "search",
		title: "Buscar",
		desc: "Busca información de la empresa.",
		icon: (
			<svg
				className="w-8 h-8 text-teal-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
				<line
					x1="21"
					y1="21"
					x2="16.65"
					y2="16.65"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		),
	},
	{
		key: "data",
		title: "Datos & Reportes",
		desc: "Visualiza los datos y reportes de la empresa.",
		icon: (
			<svg
				className="w-8 h-8 text-teal-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect
					x="3"
					y="3"
					width="18"
					height="18"
					rx="2"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path
					d="M9 17v-6M15 17v-2M12 17v-4"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		),
	},
	{
		key: "profile",
		title: "Perfil de la empresa",
		desc: "Información general y de contacto.",
		icon: (
			<svg
				className="w-8 h-8 text-teal-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect
					x="4"
					y="4"
					width="16"
					height="16"
					rx="2"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
				<path
					d="M6 18v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		),
	},
	{
		key: "resources",
		title: "Recursos",
		desc: "Accede a recursos y documentos de la empresa.",
		icon: (
			<svg
				className="w-8 h-8 text-teal-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path
					d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<rect
					x="4"
					y="4"
					width="16"
					height="16"
					rx="2"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		),
	},
	{
		key: "info",
		title: "Información",
		desc: "Detalles adicionales de la empresa.",
		icon: (
			<svg
				className="w-8 h-8 text-teal-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
				<line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
				<line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
	},
	{
		key: "welcome",
		title: "Bienvenida",
		desc: "Mensaje de bienvenida de la empresa.",
		icon: (
			<svg
				className="w-8 h-8 text-teal-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path
					d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<polyline points="3 7 12 13 21 7" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
	},
];

export default function EmpresaPublic() {
	const navigate = useNavigate();
	const { id, empresaId } = useParams();
	const [empresa, setEmpresa] = useState<any>(null);

	useEffect(() => {
		fetch(`http://localhost:5214/api/empresas/${id}`)
			.then((res) => res.json())
			.then(setEmpresa);
	}, [id]);

	if (!empresa) return <div className="p-8">Cargando...</div>;

	return (
		<>
			<EmpresaNavbar
				nombre={empresa.nombre}
				logotipoUrl={empresa.logotipoUrl}
			/>
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-8">
					Bienvenido, {empresa.nombre}.
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{CARDS.map((card, idx) => (
						<div
							key={card.key}
							className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start transition duration-200 hover:scale-105 hover:shadow-lg"
						>
							{card.icon}
							<div className="mt-4 font-semibold text-lg">{card.title}</div>
							<div className="text-gray-500">{card.desc}</div>
							{card.key === "profile" && (
								<div className="mt-2 text-sm text-gray-700">
									<b>País:</b> {empresa.pais}
									<br />
									<b>Región:</b> {empresa.region}
									<br />
									<b>Zona:</b> {empresa.zona}
									<br />
									<b>Estado:</b> {empresa.activo ? "Activo" : "Inactivo"}
								</div>
							)}
							{card.key === "welcome" && (
								<div className="mt-2 text-sm text-gray-700">
									{empresa.textoBienvenida}
								</div>
							)}
							{card.key === "data" && (
								<div className="mt-2 text-sm text-gray-700">
									<button
										className="bg-teal-500 text-white rounded-md px-4 py-2 text-sm font-semibold transition duration-200 hover:bg-teal-600"
										onClick={() =>
											navigate(
												`/empresas/${empresaId}/datos-reportes`
											)
										}
									>
										Ver Reportes
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);
}