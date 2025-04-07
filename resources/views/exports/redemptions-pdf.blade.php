<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Historial de Canjes</title>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            font-size: 12px;
            line-height: 1.3;
        }
        h1 { 
            color: #15803d; 
            text-align: center; 
            font-size: 18px; 
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            margin-bottom: 20px;
            font-size: 11px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
        }
        th { 
            background-color: #15803d; 
            color: white; 
            text-align: left; 
            padding: 8px; 
            font-size: 11px;
        }
        td { 
            border-bottom: 1px solid #ddd; 
            padding: 7px;
            font-size: 10px;
        }
        .summary { 
            margin-top: 20px; 
            padding: 10px; 
            background-color: #f0f9f0; 
        }
    </style>
</head>
<body>
    <h1>Historial de Canjes</h1>
    <p class="subtitle">Reporte generado el {{ $date }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Recompensa</th>
                <th>Usuario</th>
                <th>Puntos</th>
            </tr>
        </thead>
        <tbody>
            @foreach($redemptions as $redemption)
            <tr>
                <td>{{ $redemption['code'] }}</td>
                <td>{{ $redemption['date'] }}</td>
                <td>{{ $redemption['reward'] }}</td>
                <td>{{ $redemption['user'] }}</td>
                <td>{{ $redemption['points'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="summary">
        <p><strong>Total de canjes:</strong> {{ $count }}</p>
        <p><strong>Total de puntos acumulados:</strong> {{ $totalPoints }}</p>
    </div>
</body>
</html>