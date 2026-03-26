import { describe, it, expect, beforeEach } from 'vitest';
import {
  marcadores,
  handleAgregarMarcador,
  handleBuscarMarcadores,
  handleEliminarMarcador,
  handleListarMarcadores,
  handleListarCategorias,
} from '../marcadores-mcp.js';

describe('Marcadores MCP Server', () => {
  beforeEach(() => {
    marcadores.clear();
  });

  it('agregar_marcador devuelve ID y mensaje de confirmación', () => {
    const result = handleAgregarMarcador('https://example.com', 'Example', 'web');
    expect(result.id).toBeTruthy();
    expect(result.text).toContain('✅');
    expect(result.text).toContain('Example');
    expect(result.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('agregar_marcador usa categoría general por defecto', () => {
    const result = handleAgregarMarcador('https://example.com', 'Sin Categoría');
    const marcador = marcadores.get(result.id);
    expect(marcador?.categoria).toBe('general');
  });

  it('buscar_marcadores encuentra por título', () => {
    handleAgregarMarcador('https://example.com', 'Mi Test', 'web');
    const result = handleBuscarMarcadores('Test');
    expect(result).toContain('Mi Test');
  });

  it('buscar_marcadores encuentra por URL', () => {
    handleAgregarMarcador('https://github.com/codigosinsiesta', 'GitHub', 'dev');
    const result = handleBuscarMarcadores('github');
    expect(result).toContain('github.com');
  });

  it('buscar_marcadores encuentra por categoría', () => {
    handleAgregarMarcador('https://example.com', 'Ejemplo', 'devops');
    const result = handleBuscarMarcadores('devops');
    expect(result).toContain('Ejemplo');
  });

  it('buscar_marcadores devuelve mensaje vacío para término inexistente', () => {
    const result = handleBuscarMarcadores('xyznonexistent');
    expect(result).toContain('No se encontraron');
  });

  it('eliminar_marcador elimina correctamente', () => {
    const { id } = handleAgregarMarcador('https://example.com', 'Test', 'web');
    const result = handleEliminarMarcador(id);
    expect(result).toContain('🗑️');
    expect(marcadores.has(id)).toBe(false);
  });

  it('eliminar_marcador error para ID inexistente', () => {
    const result = handleEliminarMarcador('id-que-no-existe');
    expect(result).toContain('❌');
  });

  it('listar_marcadores muestra mensaje vacío cuando no hay marcadores', () => {
    const result = handleListarMarcadores();
    expect(result).toContain('No hay marcadores');
  });

  it('listar_marcadores muestra todos los marcadores guardados', () => {
    handleAgregarMarcador('https://a.com', 'Sitio A', 'cat1');
    handleAgregarMarcador('https://b.com', 'Sitio B', 'cat2');
    const result = handleListarMarcadores();
    expect(result).toContain('Sitio A');
    expect(result).toContain('Sitio B');
    expect(result).toContain('(2)');
  });

  it('listar_categorias agrupa correctamente', () => {
    handleAgregarMarcador('https://a.com', 'A', 'dev');
    handleAgregarMarcador('https://b.com', 'B', 'dev');
    handleAgregarMarcador('https://c.com', 'C', 'web');
    const result = handleListarCategorias();
    expect(result).toContain('dev');
    expect(result).toContain('web');
  });
});
