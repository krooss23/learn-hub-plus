import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Calendar = () => {
  // Datos simulados para el calendario
  const events = [
    { id: 1, title: "Entrega de Proyecto", date: "2025-05-20", course: "Desarrollo Web", type: "assignment" },
    { id: 2, title: "Examen Parcial", date: "2025-05-23", course: "Mecanica", type: "exam" },
    { id: 3, title: "Sesión de mecanica", date: "2025-05-18", course: "Física", type: "event" },
    { id: 4, title: "Mecanica Avanzada", date: "2025-05-25", course: "Tecnología", type: "webinar" },
    { id: 5, title: "Revisión de cableado", date: "2025-05-19", course: "", type: "assignment" }
  ];

  // Estado para la frase motivacional
  const [frase, setFrase] = useState<string>("");
  const [autor, setAutor] = useState<string>("");

  // Efecto para obtener una frase motivacional al cargar el componente
  useEffect(() => {
    fetch("http://localhost:5214/api/motivacional/frase") // Cambia aquí el puerto y usa http
      .then(res => res.json())
      .then(data => {
        setFrase(data.frase);
        setAutor(data.autor);
      })
      .catch(() => {
        setFrase("¡Hoy es un gran día para aprender!");
        setAutor("");
      });
  }, []);

  // Función para obtener eventos del día actual
  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };
  
  // Función para obtener eventos de esta semana
  const getWeekEvents = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
  };
  
  // Función para obtener eventos del mes
  const getMonthEvents = () => events;
  
  // Función para generar contenido del calendario mensual
  const generateMonthCalendar = () => {
    const daysInMonth = 31; // Simplificado
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEvents = events.filter(event => {
        const eventDay = new Date(event.date).getDate();
        return eventDay === i;
      });
      
      days.push(
        <div key={i} className={`border p-2 h-24 overflow-y-auto ${dayEvents.length > 0 ? 'bg-gray-50' : ''}`}>
          <div className="font-semibold mb-1">{i}</div>
          {dayEvents.map(event => (
            <div key={event.id} className={`text-xs p-1 mb-1 rounded truncate ${getEventColor(event.type)}`}>
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };
  
  // Función para obtener color según tipo de evento
  const getEventColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'webinar':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Estado para el modal de nuevo evento
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    course: "",
    type: "assignment"
  });

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
          <div className="space-y-6 w-full max-w-7xl flex flex-col items-center justify-center">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">
              {/* Calendario más pequeño */}
              <div className="flex-1 max-w-xl flex justify-center">
                <Tabs defaultValue="month">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="today">Hoy</TabsTrigger>
                      <TabsTrigger value="week">Semana</TabsTrigger>
                      <TabsTrigger value="month">Mes</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Mayo 2025
                      </Button>
                      <div className="space-x-1">
                        <Button variant="outline" size="icon">
                          &lt;
                        </Button>
                        <Button variant="outline" size="icon">
                          &gt;
                        </Button>
                      </div>
                    </div>
                  </div>
                  <TabsContent value="today" className="space-y-4">
                    <Card className="text-sm">
                      <CardHeader>
                        <CardTitle className="text-base">Eventos de Hoy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getTodayEvents().length > 0 ? (
                          <div className="space-y-3">
                            {getTodayEvents().map(event => (
                              <div key={event.id} className={`p-2 rounded border-l-4 ${getEventColor(event.type)} border-l-blue-500`}>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {event.course} • {new Date(event.date).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-xs">
                            No hay eventos programados para hoy
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="week" className="space-y-4">
                    <Card className="text-sm">
                      <CardHeader>
                        <CardTitle className="text-base">Eventos de esta Semana</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getWeekEvents().length > 0 ? (
                          <div className="space-y-3">
                            {getWeekEvents().map(event => (
                              <div key={event.id} className={`p-2 rounded border-l-4 ${getEventColor(event.type)} border-l-blue-500`}>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {event.course} • {new Date(event.date).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-xs">
                            No hay eventos programados para esta semana
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="month">
                    <Card className="text-sm">
                      <CardHeader>
                        <CardTitle className="text-base">Mayo 2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-1">
                          <div className="text-center font-medium p-1">Dom</div>
                          <div className="text-center font-medium p-1">Lun</div>
                          <div className="text-center font-medium p-1">Mar</div>
                          <div className="text-center font-medium p-1">Mié</div>
                          <div className="text-center font-medium p-1">Jue</div>
                          <div className="text-center font-medium p-1">Vie</div>
                          <div className="text-center font-medium p-1">Sáb</div>
                          {/* Espacios vacíos para el inicio del mes */}
                          <div className="border p-1 h-16 opacity-50"></div>
                          <div className="border p-1 h-16 opacity-50"></div>
                          {/* Días del mes */}
                          {generateMonthCalendar()}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              {/* Próximos eventos y frase motivacional */}
              <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-2 items-center">
                <Card className="text-sm w-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Próximos Eventos</CardTitle>
                    <Button size="sm" className="ml-2" onClick={() => setOpen(true)}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Nuevo Evento
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {events.map(event => (
                        <div key={event.id} className={`p-2 rounded border-l-4 ${getEventColor(event.type)} border-l-blue-500`}>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.course} • {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Frase motivacional debajo de próximos eventos */}
                {frase && (
                  <div className="w-full flex justify-center mt-2">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 rounded text-yellow-800 text-sm font-medium max-w-xs text-center shadow">
                      <div>{frase}</div>
                      {autor && (
                        <div className="text-xs text-yellow-700 mt-2 font-normal">— {autor}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal para crear nuevo evento */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Evento</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              // Aquí puedes agregar lógica para guardar el evento
              setOpen(false);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Curso</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={newEvent.course}
                onChange={e => setNewEvent({ ...newEvent, course: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={newEvent.type}
                onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <option value="assignment">Tarea</option>
                <option value="exam">Examen</option>
                <option value="event">Evento</option>
                <option value="webinar">Webinar</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit">Crear</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Calendar;
