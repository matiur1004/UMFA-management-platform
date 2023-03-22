﻿using AutoMapper;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Entities.UMFAEntities;
using ClientPortal.Helpers;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Data
{
    public class UmfaDataMapper : Profile
    {
        public UmfaDataMapper()
        {
            CreateMap<PortalStats, PortalStatsResponse>().ReverseMap();
            CreateMap<AMRMeter, AMRMeterResponse>()
                .ForMember(d => d.UmfaId, opt => opt.MapFrom(s => s.BuildingId ))
                .ForMember(d => d.MakeModelId, opt => opt.MapFrom(s => s.MakeModel.Id))
                .ForMember(d => d.Make, opt => opt.MapFrom(s => s.MakeModel.Make))
                .ForMember(d => d.Model, opt => opt.MapFrom(s => s.MakeModel.Model))
                .ForMember(d => d.UtilityId, opt => opt.MapFrom(s => s.MakeModel.UtilityId))
                .ForMember(d => d.Utility, opt => opt.MapFrom(s => s.MakeModel.Utility.Name))
                .ReverseMap();
            CreateMap<AMRScadaUser, AMRScadaUserResponse>()
                .ForMember(d => d.ScadaPassword, opt => opt.MapFrom(s => CryptoUtils.EncryptString(s.ScadaPassword)))
                .ReverseMap()
                .ForMember(d => d.ScadaPassword, opt => opt.MapFrom(s => CryptoUtils.DecryptString(s.ScadaPassword)));
            CreateMap<AMRScadaUserRequest, AMRScadaUser>()
                .ForMember(d => d.ScadaPassword, opt => opt.MapFrom(s => CryptoUtils.DecryptString(s.ScadaPassword)))
                .ReverseMap()
                .ForMember(d => d.ScadaPassword, opt => opt.MapFrom(s => CryptoUtils.EncryptString(s.ScadaPassword)));
            CreateMap<MeterMakeModel, MakeModelResponse>();
            CreateMap<Utility, UtilityResponse>()
                .ForMember(d => d.MakeModels, opt => opt.MapFrom(s => s.MeterMakeModels));
            CreateMap<TOUHeader, AMRTOUHeaderResponse>().ReverseMap();
            CreateMap<DemandProfileResponseHeader, DemandProfileHeader>().ReverseMap();
            CreateMap<DemandProfileResponseDetail, DemandProfile>().ReverseMap();
            CreateMap<AMRWaterProfileResponseHeader, AMRWaterProfileHeader>().ReverseMap();
            CreateMap<WaterProfileResponseDetail, WaterProfile>().ReverseMap();
        }
    }
}