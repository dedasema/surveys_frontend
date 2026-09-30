import React from 'react';
import { Award, Users, ShieldCheck, UserCog, User, ArrowUpRight } from 'lucide-react';
import { TopUsuarioUso } from '../types';

export interface TopUsersRankingProps {
  usuarios: TopUsuarioUso[];
}

export const TopUsersRanking: React.FC<TopUsersRankingProps> = ({ usuarios }) => {
  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 1:
        return 'bg-slate-200 text-slate-700 border-slate-300 font-bold';
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getRoleBadge = (rol: string) => {
    switch (rol.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      case 'suscriptor':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <User className="w-3 h-3" /> Suscriptor
          </span>
        );
      case 'operador':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <UserCog className="w-3 h-3" /> Operador
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Top 5 Usuarios con Mayor Actividad
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Operadores y administradores con más transacciones registradas en auditoría
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {usuarios.map((u, idx) => (
          <div
            key={u.usuario_id || idx}
            className="py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 px-2 rounded-xl transition"
          >
            {/* Rank & User Info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Position Number */}
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${getRankBadge(
                  idx
                )} flex-shrink-0`}
              >
                {idx + 1}
              </span>

              {/* Avatar Initial */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'U'}
              </div>

              {/* Name & Email */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 truncate">{u.nombre}</span>
                  {getRoleBadge(u.rol)}
                </div>
                <span className="text-xs text-gray-400 block truncate">{u.email}</span>
              </div>
            </div>

            {/* Total Operations */}
            <div className="text-right flex-shrink-0">
              <span className="text-base font-black text-gray-900 block">
                {u.total_operaciones}
              </span>
              <span className="text-2xs text-gray-400 uppercase font-semibold">
                operaciones
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsersRanking;
