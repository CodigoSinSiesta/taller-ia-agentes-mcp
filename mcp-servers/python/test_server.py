import json
import pytest
import server


@pytest.fixture(autouse=True)
def limpiar():
    server.marcadores.clear()
    yield
    server.marcadores.clear()


def test_agregar_marcador():
    result = server.agregar_marcador(
        url="https://example.com", titulo="Example", categoria="web"
    )
    assert "✅" in result
    assert "Example" in result
    assert len(server.marcadores) == 1


def test_buscar_por_titulo():
    server.agregar_marcador(
        url="https://test.com", titulo="Mi Test Especial", categoria="web"
    )
    result = server.buscar_marcadores(termino="Test Especial")
    assert "Mi Test Especial" in result


def test_buscar_sin_resultados():
    result = server.buscar_marcadores(termino="xyznonexistente123")
    assert "No se encontraron" in result


def test_eliminar_marcador():
    result_add = server.agregar_marcador(
        url="https://del.com", titulo="Borrar", categoria="test"
    )
    id_marcador = result_add.split("ID: ")[-1].strip()
    result = server.eliminar_marcador(id_marcador=id_marcador)
    assert "🗑️" in result
    assert id_marcador not in server.marcadores


def test_eliminar_inexistente():
    result = server.eliminar_marcador(id_marcador="id-fantasma-xyz")
    assert "❌" in result


def test_buscar_por_url():
    server.agregar_marcador(
        url="https://github.com/codigosinsiesta", titulo="GitHub CSI", categoria="dev"
    )
    result = server.buscar_marcadores(termino="github.com")
    assert "GitHub CSI" in result


def test_listar_todos_resource():
    server.agregar_marcador(
        url="https://res.com", titulo="Resource Test", categoria="test"
    )
    result = server.listar_todos()
    data = json.loads(result)
    assert isinstance(data, list)
    assert len(data) >= 1
