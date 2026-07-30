INSERT IGNORE INTO organizational_roles (name, sort_order) VALUES
  ('Activista', 10),
  ('Coordinador nacional', 20),
  ('Subcoordinador nacional', 30),
  ('Coordinador nacional de operaciones digitales', 40),
  ('Coordinador nacional de contenidos', 50),
  ('Coordinador nacional de sondeos', 60),
  ('Coordinador municipal', 70),
  ('Coordinador provincial', 80),
  ('Coordinador regional', 90),
  ('Coordinador macroregional', 100),
  ('Apoyo de contenidos', 110),
  ('Escuadra de sondeos', 120);

INSERT IGNORE INTO skills (name, sort_order) VALUES
  ('Comentarios estratégicos', 10),
  ('Compartir y amplificar', 20),
  ('Moderación de comunidades', 30),
  ('Sondeos y votaciones', 40),
  ('Creación de contenido', 50),
  ('Video corto', 60),
  ('Diseño gráfico', 70),
  ('Monitoreo temprano', 80);

INSERT IGNORE INTO national_coordination (singleton_id) VALUES (1);

INSERT IGNORE INTO province_plans
  (province, region_name, macro_region, planned_cells, unit_goal, provincial_goal)
VALUES
  ('Azua', 'Valdesia', 'Suroeste', 4, 10, 20),
  ('Bahoruco', 'Enriquillo', 'Suroeste', 2, 10, 20),
  ('Barahona', 'Enriquillo', 'Suroeste', 4, 10, 20),
  ('Dajabón', 'Cibao Noroeste', 'Norte', 3, 10, 20),
  ('Distrito Nacional', 'Ozama', 'Sureste', 1, 20, 20),
  ('Duarte', 'Cibao Nordeste', 'Norte', 4, 10, 20),
  ('Elías Piña', 'El Valle', 'Suroeste', 2, 10, 20),
  ('El Seibo', 'Yuma', 'Sureste', 2, 10, 20),
  ('Espaillat', 'Cibao Norte', 'Norte', 4, 10, 20),
  ('Hato Mayor', 'Higüamo', 'Sureste', 3, 10, 20),
  ('Hermanas Mirabal', 'Cibao Nordeste', 'Norte', 2, 10, 20),
  ('Independencia', 'Enriquillo', 'Suroeste', 2, 10, 20),
  ('La Altagracia', 'Yuma', 'Sureste', 4, 10, 20),
  ('La Romana', 'Yuma', 'Sureste', 3, 10, 20),
  ('La Vega', 'Cibao Sur', 'Norte', 4, 10, 20),
  ('María Trinidad Sánchez', 'Cibao Nordeste', 'Norte', 4, 10, 20),
  ('Monseñor Nouel', 'Cibao Sur', 'Norte', 3, 10, 20),
  ('Monte Cristi', 'Cibao Noroeste', 'Norte', 4, 10, 20),
  ('Monte Plata', 'Higüamo', 'Sureste', 4, 10, 20),
  ('Pedernales', 'Enriquillo', 'Suroeste', 2, 10, 20),
  ('Peravia', 'Valdesia', 'Suroeste', 3, 10, 20),
  ('Puerto Plata', 'Cibao Norte', 'Norte', 4, 10, 20),
  ('Samaná', 'Cibao Nordeste', 'Norte', 3, 10, 20),
  ('San Cristóbal', 'Valdesia', 'Suroeste', 6, 10, 20),
  ('San José de Ocoa', 'Valdesia', 'Suroeste', 2, 10, 20),
  ('San Juan', 'El Valle', 'Suroeste', 5, 10, 20),
  ('San Pedro de Macorís', 'Higüamo', 'Sureste', 4, 10, 20),
  ('Sánchez Ramírez', 'Cibao Sur', 'Norte', 3, 10, 20),
  ('Santiago', 'Cibao Norte', 'Norte', 7, 10, 20),
  ('Santiago Rodríguez', 'Cibao Noroeste', 'Norte', 2, 10, 20),
  ('Santo Domingo', 'Ozama', 'Sureste', 7, 20, 20),
  ('Valverde', 'Cibao Noroeste', 'Norte', 3, 10, 20);

INSERT IGNORE INTO exterior_plans
  (seccional, zone_name, macro_region, circunscription_count, sectional_directive_goal, circunscription_goal)
VALUES
  ('Nueva York', 'USA y Canadá', 'Exterior', 1, 20, 20),
  ('New Jersey', 'USA y Canadá', 'Exterior', 1, 20, 20),
  ('Boston', 'USA y Canadá', 'Exterior', 1, 20, 20),
  ('Miami', 'Florida', 'Exterior', 1, 20, 20),
  ('Puerto Rico', 'Caribe', 'Exterior', 1, 20, 20),
  ('Madrid', 'Europa', 'Exterior', 1, 20, 20),
  ('Barcelona', 'Europa', 'Exterior', 1, 20, 20),
  ('Zurich', 'Europa', 'Exterior', 1, 20, 20);
