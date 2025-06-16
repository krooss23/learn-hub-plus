import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCapIcon, PlusIcon, UserIcon, UsersIcon, BookIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

const featuredVehicles = [
	{ name: "Mercedes-Benz", img: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d" },
	{ name: "Ford", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b" },
	{ name: "Iveco", img: "https://images.unsplash.com/photo-1502877338535-766e1452684a" },
	{ name: "Volvo", img: "https://images.unsplash.com/photo-1502877338535-766e1452684a" }
];

interface AdminDashboardProps {
	empresas: any[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ empresas }) => {
	// Mock statistics data
	const stats = {
		courses: 42,
		students: 756,
		teachers: 28,
		completionRate: 78
	};
	
	const [empresasState, setEmpresas] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5214/api/empresas")
			.then(res => res.json())
			.then(setEmpresas);
	}, []);

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<h1 className="text-2xl font-bold">Panel de Administración</h1>
				<div className="space-x-2">
					<Button asChild>
						<Link to="/new-user">
							<PlusIcon className="h-4 w-4 mr-2" />
							Nuevo Usuario
						</Link>
					</Button>
					<Button asChild variant="outline">
						<Link to="/courses/create">
							<PlusIcon className="h-4 w-4 mr-2" />
							Nuevo Curso
						</Link>
					</Button>
				</div>
			</div>
			
			{/* Stats cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total de Cursos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center">
							<BookIcon className="h-6 w-6 text-kampus-primary mr-2" />
							<span className="text-2xl font-bold">{stats.courses}</span>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Estudiantes Registrados
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center">
							<UsersIcon className="h-6 w-6 text-kampus-secondary mr-2" />
							<span className="text-2xl font-bold">{stats.students}</span>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Profesores
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center">
							<GraduationCapIcon className="h-6 w-6 text-kampus-accent mr-2" />
							<span className="text-2xl font-bold">{stats.teachers}</span>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Índice de Finalización
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center">
							<UserIcon className="h-6 w-6 text-purple-500 mr-2" />
							<span className="text-2xl font-bold">{stats.completionRate}%</span>
						</div>
					</CardContent>
				</Card>
			</div>
			
			{/* Marcas */}
			<Card>
				<CardHeader>
					<CardTitle>Marcas</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						{empresasState.map(empresa => (
							<Link
								key={empresa.id}
								to={`/empresas/${empresa.id}/public`}
								className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center p-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
								style={{ textDecoration: "none" }}
							>
								<img
									src={
										empresa.logotipoUrl
											? `http://localhost:5214${empresa.logotipoUrl}`
											: "/logo-placeholder.png"
									}
									alt={empresa.nombre}
									className="w-full h-40 object-cover rounded-lg"
									onError={e => {
										(e.currentTarget as HTMLImageElement).src = "/images/INClogo.png";
									}}
								/>
								<div className="py-3 text-center font-semibold text-gray-700">{empresa.nombre}</div>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
			
			{/* Tabs for different admin functions */}
			
		</div>
	);
};

export default AdminDashboard;
