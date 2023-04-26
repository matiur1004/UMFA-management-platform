using AutoMapper;
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
                .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.UserId))
                .ReverseMap();
            CreateMap<AMRMeter, AMRMeterRequest>()
                .ForMember(d => d.UmfaId, opt => opt.MapFrom(s => s.BuildingId))
                .ForMember(d => d.MakeModelId, opt => opt.MapFrom(s => s.MakeModel.Id))
                .ForMember(d => d.Make, opt => opt.MapFrom(s => s.MakeModel.Make))
                .ForMember(d => d.Model, opt => opt.MapFrom(s => s.MakeModel.Model))
                .ForMember(d => d.UtilityId, opt => opt.MapFrom(s => s.MakeModel.UtilityId))
                .ForMember(d => d.Utility, opt => opt.MapFrom(s => s.MakeModel.Utility.Name))
                .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.UserId))
                .ReverseMap();
            CreateMap<AMRMeterUpdateRequest, AMRMeter>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Meter.Id))
                .ForMember(d => d.Active, opt => opt.MapFrom(s => s.Meter.Active))
                .ForMember(d => d.BuildingId, opt => opt.MapFrom(s => s.Meter.UmfaId))
                .ForMember(d => d.CbSize, opt => opt.MapFrom(s => s.Meter.CbSize))
                .ForMember(d => d.CommsId, opt => opt.MapFrom(s => s.Meter.CommsId))
                .ForMember(d => d.CtSizePrim, opt => opt.MapFrom(s => s.Meter.CtSizePrim))
                .ForMember(d => d.CtSizeSec, opt => opt.MapFrom(s => s.Meter.CtSizeSec))
                .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Meter.Description))
                .ForMember(d => d.Digits, opt => opt.MapFrom(s => s.Meter.Digits))
                .ForMember(d => d.MakeModelId, opt => opt.MapFrom(s => s.Meter.MakeModelId))
                .ForMember(d => d.MeterNo, opt => opt.MapFrom(s => s.Meter.MeterNo))
                .ForMember(d => d.MeterSerial, opt => opt.MapFrom(s => s.Meter.MeterSerial))
                .ForMember(d => d.Phase, opt => opt.MapFrom(s => s.Meter.Phase))
                .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Meter.UserId))
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
            CreateMap<AMRGraphProfileResponseHeader, AMRGraphProfileHeader>().ReverseMap();
            CreateMap<GraphProfileResponseDetail, GraphProfile>().ReverseMap();
        }
    }
}
